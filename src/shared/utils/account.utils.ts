import {sign} from "jsonwebtoken";
import bcrypt from "bcrypt-nodejs";
import {jwtExpires, jwtSecret} from '../../config'


export const createToken = (customer: any) => {
    const data = {
        id: customer.customer_id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
    };
    const token = sign(data, jwtSecret, {expiresIn: jwtExpires});
    return `Bearer ${token}`
};

export const hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

export const comparePassword = (savedPassword: string, inputPassword: string) => {
    return bcrypt.compareSync(inputPassword, savedPassword);
};

export const getTokenFromAuthorization = (authorizationString: any): string => {
    return authorizationString ? authorizationString.split(" ")[1] : '';
};
