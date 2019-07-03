const shortRecordNames = {
    'product': 'PRD',
    'shopping_cart': 'SHC',
    'shipping_region': 'SHR'
};

const getRecordErrorField = (recordName: string, fieldName: string, shortFieldName?: string) => {
    return shortFieldName ? `${recordName}_${shortFieldName}` : fieldName;
};

const getShortRecordName = (recordName: string) => {
    return (shortRecordNames[recordName] || recordName.slice(0, 3)).toUpperCase();
};

export const notFoundErrorCodes = (recordName: string, lookUpField: string, shortLookUpField?: string) => {
    return {
        code: `${getShortRecordName(recordName)}_02`,
        message: `Don't exist ${recordName} with this ${(shortLookUpField || lookUpField).toUpperCase()}.`,
        field: getRecordErrorField(recordName, lookUpField, shortLookUpField),
        status: 404,
    }
};
export const notExpectedTypeErrorCodes = (recordName: string, expectedType: string,
                                          fieldName: string, shortFieldName?: string) => {
    return {
        code: `${getShortRecordName(recordName)}_01`,
        message: `The ${(shortFieldName && shortFieldName.toUpperCase()) || fieldName} is not a ${expectedType}`,
        field: getRecordErrorField(recordName, fieldName, shortFieldName),
        status: 400,
    }
};

export const userFieldExist = (fieldName: string) => {
    return {
        code: 'USR_04',
        message: `The ${fieldName} already exists.`,
        field: fieldName,
        status: 409,
    }
};

export const userNotFound = (fieldName: string) => {
    return {
        code: 'USR_05',
        message: `The ${fieldName} doesn\'t exist`,
        field: `${fieldName}`,
        status: 404,
    }
};

export const userIncorrectCredentials = () => {
    return {
        code: 'USR_01',
        message: 'Email or Password is invalid',
        status: 401,
    }
};

export const emptyAuthorizationCode = (authorizationKey: string) => {
    return {
        code: 'AUT_01',
        message: 'Authorization code is empty',
        field: authorizationKey,
        status: 401,
    }
};

export const unauthorizedAccess = (authorizationKey: string) => {
    return {
        code: 'AUT_02',
        message: 'Access Unauthorized',
        field: authorizationKey,
        status: 401,
    }
};

export const expiredAccessToken = (authorizationKey: string) => {
    return {
        code: 'AUT_03',
        message: 'Access token has expired. You are required to login again!',
        field: authorizationKey,
        status: 401,
    }
};

export const noAuthorizationKey = (authorizationKey: string) => {
    return {
        code: 'AUT_04',
        message: `Missing auth key. Please provided key in headers.${authorizationKey}`,
        field: authorizationKey,
        status: 401,
    }
};

export const customErrorCodes = {
    USER_NOT_FOUND: 'user_not_found',
    USER_CREDENTIALS_INCORRECT: 'user_incorrect_credentials'
};
