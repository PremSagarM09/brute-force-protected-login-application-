import { ResponseDto } from '../common/dto';
import { STATUS_CODES } from '../common/statusCodes';
import { getResponseMessage, setErrorResponse, setSuccessResponse } from './responseService';

export const schemaValidation = async (
  data: any,
  schema: any
): Promise<ResponseDto> => {
  try {
    let validateResult: ResponseDto;
    const { error } = await schema.validate(data);
    let response: ResponseDto;
    if (error && error.details) {
      response = setErrorResponse({
        message:
          error.details[0].message || getResponseMessage('VALIDATION_ERROR'),
      });
      validateResult = {
        statusCode: STATUS_CODES.VALIDATION_ERROR,
        ...response,
      } as ResponseDto;
      return validateResult;
    }
    response = setSuccessResponse({
      message: getResponseMessage('VALIDATION_SUCCESS'),
    });
    return (validateResult = {
      statusCode: STATUS_CODES.SUCCESS,
      ...response,
    } as ResponseDto);
  } catch (error) {
    const result: ResponseDto = setErrorResponse({
      message: getResponseMessage('SOMETHING_WRONG'),
      error,
      statusCode: STATUS_CODES.INTERNAL_ERROR,
    });
    return result;
  }
};
