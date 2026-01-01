import { JwtDTO, ResponseDto } from "../common/dto";
import { getResponseMessage, setErrorResponse, setSuccessResponse } from "../helpers/responseService";
import { LoginDTO, setPasswordDTO } from "./auth.dto";
import jwt from "jsonwebtoken";
import envConfig from "../config/config";
import { UsersModel } from "../models/user.model";
import bcrypt from 'bcryptjs';
import ipAddressModel from "../models/ipAddress.model";
import LoginLog from "../models/loginLog.model";
import { STATUS_CODES } from "../common/statusCodes";
import { Op } from "sequelize";

const createJWTToken = (user: JwtDTO, refresh_token: string) => {
    const access_token: string = refresh_token as unknown as string;
    return jwt.sign(user, access_token, {
        expiresIn: (envConfig.jwtAccessExpiry as unknown as number) || '1d',
    });
};

const createRefreshToken = (user: JwtDTO) => {
    const secretKey: string = envConfig.jwtSecret as unknown as string;
    return jwt.sign(user, secretKey);
};

export const login = async (
    loginData: LoginDTO
): Promise<ResponseDto> => {
    try {
        const { email, password, ip_address } = loginData;

        // Verify user existence with given email
        const user: any = await UsersModel.findOne({
            where: { email: email?.trim() },
        });

        if (!user) {
            return setErrorResponse({
                message: getResponseMessage('USER_NOT_FOUND'),
                statusCode: STATUS_CODES.BAD_REQUEST
            });
        }

        // Check if IP is already registered or not and block status
        const [ipBlockDetails, created] = await ipAddressModel.findOrCreate({
            where: { ip_address },
            defaults: { number_of_attempts: 0, is_ip_blocked: false }
        });

        if (ipBlockDetails?.is_ip_blocked) {
            return setErrorResponse({
                message: getResponseMessage('IP_BLOCKED'),
                statusCode: STATUS_CODES.BAD_REQUEST
            });
        }


        const block_15 = Boolean(user.block_15);
        const maxAttempts = Number(user.max_attempts ?? 5);
        const maxIpAttempts = Number(user.max_ip_attempts ?? 100);
        let failedAttempts = 0;
        let message: string = getResponseMessage('INVALID_CREDENTIALS');

        if (block_15) {
            const lastLoginAttempt: any = await LoginLog.findOne({
                where: { user_id: user.id },
                order: [['id', 'DESC']]
            });
            if (lastLoginAttempt) {
                const blockDuration = 15 * 60 * 1000;
                const unblockTime = new Date(lastLoginAttempt.createdAt.getTime() + blockDuration);
                if (new Date() >= unblockTime) {
                    await UsersModel.update(
                        { block_15: false },
                        { where: { id: user.id } }
                    );
                }
            } else {
                return setErrorResponse({
                    message: getResponseMessage('USER_BLOCKED_FOR_TOO_MANY_ATTEMPTS'),
                    statusCode: STATUS_CODES.BAD_REQUEST
                });
            }
        }

        if (!created) {
            const now = Date.now();
            const fiveMinutesAgo = new Date(now - 5 * 60 * 1000);

            const failedAttemptsLast5Min = await LoginLog.count({
                where: {
                    ip_id: ipBlockDetails.id,
                    user_id: user.id,
                    createdAt: {
                        [Op.gte]: fiveMinutesAgo,
                        [Op.lte]: now
                    }
                }
            });
            failedAttempts = failedAttemptsLast5Min
            if (failedAttemptsLast5Min >= maxAttempts) {
                await UsersModel.update(
                    { block_15: true },
                    { where: { id: user.id } }
                );

                return setErrorResponse({
                    message: getResponseMessage('USER_BLOCKED_FOR_TOO_MANY_ATTEMPTS'),
                    statusCode: STATUS_CODES.BAD_REQUEST
                });

            }

        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const jwtPayload: JwtDTO = {
                userId: user.id,
                email: user.email,
                username: user.username
            };

            const refresh_token = createRefreshToken(jwtPayload);
            const access_token = createJWTToken(jwtPayload, refresh_token);

            await UsersModel.update(
                { refresh_token, block_15: false },
                { where: { id: user.id } }
            );

            await LoginLog.create({
                ip_id: ipBlockDetails.id,
                user_id: user.id,
                is_successful: true
            });

            return setSuccessResponse({
                message: getResponseMessage('LOGIN_SUCCESS'),
                data: {
                    access_token,
                    userDetails: jwtPayload
                }
            });
        }

        const number_of_attempts = Number(ipBlockDetails.number_of_attempts ?? 0) + 1;
        const is_ip_blocked = number_of_attempts >= maxIpAttempts;
        const isUserBlocked = failedAttempts + 1 >= maxAttempts;


        if (isUserBlocked) {
            message = getResponseMessage('USER_BLOCKED_FOR_TOO_MANY_ATTEMPTS')
        }

        if (is_ip_blocked) {
            message = getResponseMessage('IP_BLOCKED');
        }

        await user.update({
            block_15: isUserBlocked
        })
        await LoginLog.create({ ip_id: ipBlockDetails.id, user_id: user.id });

        await ipBlockDetails.update({
            number_of_attempts,
            is_ip_blocked
        });


        return setErrorResponse({
            message,
            statusCode: STATUS_CODES.BAD_REQUEST
        });

    } catch (error) {
        return setErrorResponse({
            statusCode: 500,
            message: getResponseMessage('SOMETHING_WRONG'),
            error,
            detail: error
        });
    }
};


export const setPasswordForUser = async (
    payload: setPasswordDTO,
): Promise<ResponseDto> => {
    try {
        const { email, password, mobile } = payload;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword: string = await bcrypt.hash(password, salt);
        const condition: any = { email: email ? email.trim() : "" };
        let nameArray: string[] = [];

        if (typeof email === 'string') {
            const namePart = email.split('@')?.[0] ?? '';
            nameArray = namePart.split('.');
        }
        const user: any = await UsersModel.findOrCreate({
            defaults: {
                first_name: nameArray[0] ?? '',
                last_name: nameArray[1] ?? '',
                password: hashedPassword,
                email: email?.trim() ?? '',
                mobile: mobile ? String(mobile) : '',
            },
            where: {
                ...condition,
            },
        });
        const response: ResponseDto = setSuccessResponse({
            message: getResponseMessage('PASSWORD_SET_SUCCESS'),
        });
        return response;
    } catch (error) {
        const result: ResponseDto = setErrorResponse({
            message: getResponseMessage('SOMETHING_WRONG'),
            error,
        });
        return result;
    }
};