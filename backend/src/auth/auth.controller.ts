import { getResponseMessage, setErrorResponse } from "../helpers/responseService";
import { ResponseDto } from "../common/dto";
import { Request, Response } from "express";
import { STATUS_CODES } from "../common/statusCodes";
import Joi from "joi";
import { LoginDTO, setPasswordDTO } from "./auth.dto";
import { schemaValidation } from "../helpers/validation";
import { login as loginService, setPasswordForUser as setPasswordForUserService } from "./auth.service";

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const userDetailsSetPassword = req.body as LoginDTO;
    const schema = Joi.object().options({ abortEarly: false }).keys({
      email: Joi.string().email().trim().required(),
      password: Joi.string().required(),
      ip_address: Joi.string().required(),
    });
    const validateResult: ResponseDto = await schemaValidation(
      userDetailsSetPassword,
      schema
    );
    if (!validateResult.status) {
      return res.json(validateResult).status(200);
    } else {
      const response = await loginService(userDetailsSetPassword);
      return res.json(response).status(200);
    }
  } catch (error) {
    const result: ResponseDto = setErrorResponse({
      statusCode: STATUS_CODES.INTERNAL_ERROR,
      message: getResponseMessage('SOMETHING_WRONG'),
      error,
      detail: error,
    });
    return res.status(STATUS_CODES.INTERNAL_ERROR).json(result);
  }
};

export const setPasswordForUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let response: ResponseDto;
    const payload: setPasswordDTO = req.body as unknown as setPasswordDTO;

    const schema: any = Joi.object()
      .options({})
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required().min(8),
        mobile: Joi.string().optional().allow(null, '', ' '),
      });
    const validateResult: ResponseDto = await schemaValidation(payload, schema);

    if (!validateResult.status) {
      return res.json(validateResult).status(200);
    } else {
      response = await setPasswordForUserService(payload);
      return res.json(response).status(200);
    }
  } catch (error: any) {
    res.status(500);
    const response: ResponseDto = setErrorResponse({
      message: getResponseMessage('SOMETHING_WRONG'),
      error: error.message,
      statusCode: 500,
    });
    return res.json(response).status(200);
  }
};