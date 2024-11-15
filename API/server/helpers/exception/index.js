
export default class Exception {

    static SERVER_ERROR_EXCEPTION = 'serverErrorException';

    static DUPLICATE_ENTRIES_EXCEPTION = 'duplicateEntriesException';

    static MODEL_NOT_FOUND_EXCEPTION = 'modelNotFoundException';

    static ROLE_NOT_FOUND_EXCEPTION = 'roleNotFoundException';

    static FILE_NOT_UPLOADED = 'fileNotUploaded';

    static INVALID_INPUT = 'invalidInputException';

    static INVALID_TOKEN_EXCEPTION = 'invalidTokenException';

    static EXPIRED_TOKEN_EXCEPTION = 'expiredTokenException';

    static NO_TOKEN_EXCEPTION = 'noTokenException';

    static INVALID_INPUT_EXCEPTION = 'invalidInputException';

    static INVALID_PASSWORD_EXCEPTION = 'invalidPasswordException';

    static INVALID_USER_EXCEPTION = 'invalidUserException';

    static INVALID_AUTH_EXCEPTION = 'invalidAuthenticationException';

    static NULL_PASSWORD_EXCEPTION = 'nullPasswordException';

    static TEMPLATE_MISMATCH = 'templatemismatch';

    static CONTENT_NOT_FOUND = 'contentnotfound';

    static WARN_EXCEPTION = 'warnException';

    static UNAUTHORIZED_ACCESS_EXCEPTION = 'unauthorizedAccessException';

    static handleMessage(err) {
        switch (err.message) {
            case Exception.MODEL_NOT_FOUND_EXCEPTION:
                return {
                    status: 404,
                    type: Exception.MODEL_NOT_FOUND_EXCEPTION,
                    message: 'Entity not found',
                };

            case Exception.ROLE_NOT_FOUND_EXCEPTION:
                return {
                    status: 409,
                    type: this.ROLE_NOT_FOUND_EXCEPTION,
                    message: 'Role not defined for user ',
                };

            case Exception.DUPLICATE_ENTRIES_EXCEPTION:
                return {
                    status: 409,
                    type: this.DUPLICATE_ENTRIES_EXCEPTION,
                    message: 'Entity with this name already exist',
                };
            case Exception.TEMPLATE_MISMATCH:
                return {
                    status: 400,
                    type: this.TEMPLATE_MISMATCH,
                    message: 'Template mismatch with upload file',
                };

            case Exception.INVALID_AUTH_EXCEPTION:
                return {
                    status: 400,
                    type: this.INVALID_AUTH_EXCEPTION,
                    message: 'No access to create user',
                };

            case Exception.INVALID_USER_EXCEPTION:
                return {
                    status: 401,
                    type: this.INVALID_USER_EXCEPTION,
                    message: 'Please enter the correct email',
                };

            case Exception.INVALID_TOKEN_EXCEPTION:
                return {
                    status: 400,
                    type: this.INVALID_TOKEN_EXCEPTION,
                    message: 'Invalid Token',
                };

            case Exception.EXPIRED_TOKEN_EXCEPTION:
                return {
                    status: 401,
                    type: this.EXPIRED_TOKEN_EXCEPTION,
                    message: 'Token Expired',
                };

            case Exception.NO_TOKEN_EXCEPTION:
                return {
                    status: 401,
                    type: this.NO_TOKEN_EXCEPTION,
                    message: 'No Token',
                };

            case Exception.INVALID_INPUT_EXCEPTION:
                return {
                    status: 401,
                    type: this.INVALID_INPUT_EXCEPTION,
                    message: err.detailedMessage || 'No Valid Input',
                };

            case Exception.INVALID_PASSWORD_EXCEPTION:
                return {
                    status: 401,
                    type: this.INVALID_PASSWORD_EXCEPTION,
                    message: 'Please enter the correct password',
                };

            case Exception.FILE_NOT_UPLOADED:
                return {
                    status: 401,
                    type: this.FILE_NOT_UPLOADED,
                    message: 'File Not Uploaded',
                };

            case Exception.NULL_PASSWORD_EXCEPTION:
                return {
                    status: 401,
                    type: this.NULL_PASSWORD_EXCEPTION,
                    message: 'Null Password '
                };

            case Exception.UNAUTHORIZED_ACCESS_EXCEPTION:
                return {
                    status: 401,
                    type: Exception.UNAUTHORIZED_ACCESS_EXCEPTION,
                    message: 'Unauthorized Access',
                };

            case Exception.CONTENT_NOT_FOUND:
                return {
                    status: 204,
                    type: Exception.CONTENT_NOT_FOUND,
                    message: 'No Content',
                };

            default:
                return {
                    status: 500,
                    type: Exception.SERVER_ERROR_EXCEPTION,
                    message: 'Internal Server Error',
                };
        }
    }

    static handleCode(err) {

        switch (err.code) {
            case '23503':
                return {
                    status: 400,
                    type: Exception.INVALID_INPUT,
                    message: err.detail || err.message,
                };

            case '23505':
                return {
                    status: 400,
                    type: Exception.INVALID_INPUT,
                    message: 'Email Already Exist',
                };

            case '1234':
                return {
                    status: 200,
                    type: Exception.INVALID_INPUT,
                    message: 'User ' + err.name + ' has already triggered a job at ' + err.timestamp +
                        ' Please wait for 5-10 mins ' +
                        'for the existing job to complete',
                };
            case '12345':
                return {
                    status: 400,
                    type: Exception.INVALID_INPUT,
                    message: 'Uploaded file Invalid',
                };
            case '3225':
                return {
                    status: 200,
                    type: Exception.INVALID_INPUT,
                    message: 'System Dataload In Progress',
                };
            case 'ER_DUP_ENTRY':
                return {
                    status: 400,
                    type: err.code,
                    message: err.sqlMessage,
                }; 
            case 'ER_NO_REFERENCED_ROW_2':
                return {
                    status: 400,
                    type: Exception.INVALID_INPUT,
                    message: err.sqlMessage,
                }; 
            case 'ER_TRUNCATED_WRONG_VALUE':
                return {
                    status: 400,
                    type: Exception.INVALID_INPUT,
                    message: err.sqlMessage,
                }; 
            case 'ER_NO_DEFAULT_FOR_FIELD':
                return {
                    status: 400,
                    type: Exception.INVALID_INPUT,
                    message: err.sqlMessage,
                }; 
            case 'ER_BAD_FIELD_ERROR':
                return {
                    status: 400,
                    type: Exception.INVALID_INPUT,
                    message: err.sqlMessage,
                }; 
            case 'ER_NON_UNIQ_ERROR':
                return {
                    status: 400,
                    type: Exception.INVALID_INPUT,
                    message: err.sqlMessage,
                }; 
        }
    }

    static failWith(req, res, err) {
        const result = Exception.handleCode(err) || Exception.handleMessage(err);
        const data = {
            error: {
                type: result.type,
                message: result.message
            }
        };
        req.responseTime = Date.now();
        return res
            .status(result.status)
            .json(data);

    }
}
