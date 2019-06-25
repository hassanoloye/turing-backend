import createError from 'http-errors';

const validator = require('lx-valid');


export const validate = (object: any, schema: any, options?: any) => {
    const fn = options && options.isUpdate
        ? validator.getValidationFunction()
        : validator.validate;
    const result = fn(
        object,
        schema,
        Object.assign({cast: true}, options || {}),
    );

    if (!result.valid) {
        const msg = `'${result.errors[0].property}' ${result.errors[0].message}`;
        throw createError(400, msg, result.errors);
    }
};

export const stringAndRequired = {
    minLength: 1,
    required: true,
    type: "string",
};

export const stringAndNotRequired = {
    ...stringAndRequired,
    required: false
};

export const numberAndRequired = {
    minimum: 1,
    required: true,
    type: "number",
};

export const numberAndNotRequired = {
    ...numberAndRequired,
    required: false,
};

export const phoneNumberRequired = {
    ...stringAndRequired,
    maxLength: 11,
    minLength: 11,
    conform: (value: any) => {
        return /^0[0-9]{10}$/.test(value);
    },
    messages: {
        conform: "is not valid",
    },
};

export const emailRequired = {
    ...stringAndRequired,
    format: 'email',
}
