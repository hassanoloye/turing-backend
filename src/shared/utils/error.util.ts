import {errorTypes} from "../constants";

export class CustomError extends Error {
    public code: any;
    public type = errorTypes.CUSTOM;
    constructor(code: string, message: string) {
        super(message);
        this.code = code;
    }
}

export class CustomApiError extends Error {
    public status: number;
    public error: any;
    public type = errorTypes.CUSTOM_API;
    constructor(status: number, error: any, message?: any) {
        super(message || error.message || 'Unknown error');
        this.status = status;
        this.error = error;
    }
}
