import { ResponseDto } from '../common/dto';
import config from '../config/config';
export const setSuccessResponse = function (response: ResponseDto) {
  if (!response) {
    return response;
  }

  const successResponse: ResponseDto = {
    status: true,
    statusCode: response.statusCode || 200,
  };
  if (response.message) {
    successResponse['message'] = response.message;
  }
  if (response.data) {
    successResponse['data'] = response.data;
  }

  return successResponse;
};

export const setErrorResponse = function (response: ResponseDto) {
  if (!response) {
    return response;
  }
  const debug: boolean = config.debugMode;
  const errorResponse: ResponseDto = {
    status: false,
    statusCode: response.statusCode || 400,
    message: response.message || getResponseMessage('MESSAGE_NOT_SET'),
  };

  if (response.data) {
    errorResponse['data'] = response.data;
  }

  if (response.error) {
    errorResponse['error'] = response.error.message || response.error;
    if (debug) {
      errorResponse['detail'] = response.error;
    }
  }

  return errorResponse;
};

export const getResponseMessage = function (messageKey: string) {
  const messageConstant: any = {
    MESSAGE_NOT_SET: 'no error message',
    ACCESS_TOKEN_CREATION_SUCCESS: 'Access token generated successfully',
    DUPLICATE_NAME: 'Name already exists. Please provide other name',
    SOMETHING_WRONG: 'Something went wrong. Please try again',
    SERVER_ERROR: 'Server error occurred, Please try again',
    SET_PASSWORD_SUCCESS: 'Password set successfully',
    SET_PASSWORD_FAILED: 'Password setup failed. Please try again later',
    LOGIN_SUCCESS: 'Successfully user logged',
    LOGIN_FAILED: 'Incorrect password please try again later',
    UNAUTHORIZED: 'Unauthorized token',
    UNAUTHORZATIED_USER: 'Unauthorized user',
    ALREADY_REGISTERED:
      'User already registered. Please register with other email',
    INVALID_PERMISSIONS: 'Invalid permissions',
    ACCESS_DENIED: 'Access denied',
    INVALID_TOKEN: 'Token not found',
    VALID_TOKEN: 'Valid token',
    VALIDATION_ERROR: 'Validation error occurred',
    VALIDATION_SUCCESS: 'Validated successfully',
    AUTHENTICATION_FAILED: 'Authentication failed',
    INVALID_AUTHENTICATION: 'Invalid authentication',
    AUTHENTICATION_SUCCESS: 'Authenticated Successfully',
    WRONG_AUTH_SECRET: 'wrong secret key. Please provide PROPER key',
    INVALID_CREDENTIALS: 'Invalid password. Please try again later',
    PASSWORD_SET_SUCCESS: 'Password has been set successfully',
    IP_BLOCKED: 'Access from this IP has been blocked due to multiple failed login attempts',
    USER_BLOCKED_FOR_TOO_MANY_ATTEMPTS: 'User has been blocked due to too many failed login attempts. please try again 15 minutes later',

  };

  return messageConstant[messageKey] || null;
};