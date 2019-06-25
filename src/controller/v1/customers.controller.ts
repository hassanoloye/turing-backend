import {NextFunction, Request, Response} from "express";
import {IRouteConfig} from "../../shared/interface/route-config";
import {
    emailRequired,
    numberAndRequired,
    stringAndNotRequired,
    stringAndRequired,
    validate
} from "../../services/validator";
import passport from "passport";
import {createToken, hashPassword} from "../../shared/utils/account.utils";
import BaseController from "./base.controller";
import {jwtExpires} from '../../config'
import authMiddleware from "../../middlewares/auth.middleware";
import {get, has} from "lodash";


export default class CustomersController extends BaseController {
    constructor() {
        super({});
    }

    public routesConfig: IRouteConfig[] = [{
        method: 'post',
        fnName: 'login',
        relPath: '/login/',
        middlewares: [],
    }, {
        method: 'post',
        fnName: 'create',
        relPath: '/',
        middlewares: [],
    }, {
        method: 'put',
        fnName: 'updateAddress',
        relPath: '/address',
        middlewares: [authMiddleware],
    }, {
        method: 'put',
        fnName: 'updateCreditCard',
        relPath: '/creditCard',
        middlewares: [authMiddleware],
    }];

    private _loginSchema = {
        properties: {
            email: emailRequired,
            password: {
                ...stringAndRequired,
                minLength: 6
            }
        }
    };
    private _createCustomerSchema = {
        properties: {
            ...this._loginSchema.properties,
            name: stringAndRequired,
        }
    };
    private _updateCustomerAddressSchema = {
        properties: {
            address_1: stringAndRequired,
            address_2: stringAndNotRequired,
            city: stringAndRequired,
            region: stringAndRequired,
            postal_code: stringAndRequired,
            country: stringAndRequired,
            shipping_region_id: numberAndRequired,
        }
    };
    private _updateCustomerCreditCardSchema = {
        properties: {
            credit_card: stringAndRequired
        }
    };

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._loginSchema);
            return passport.authenticate('local', (err: Error, customer: any) => {
                if (err) {
                    next(err)
                } else {
                    const token = createToken(customer);
                    return res.json({customer: {schema: customer}, accessToken: token, expiresIn: jwtExpires})
                }
            })(req, res)
        } catch (e) {
            next(e)
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._createCustomerSchema, {unknownProperties: 'error'});
            const createKwargs = {...req.body};
            createKwargs.password = hashPassword(createKwargs.password);

            await this.performCustomQuery('customer_add', createKwargs);

            // TODO: Return data without much query;
            const customer: any = await this.performCustomQuery('customer_get_login_info',
                {email: createKwargs.email}, this.fetchQueryDefaultOptions);
            const customerDetails: any = await this.performCustomQuery('customer_get_customer',
                {customer_id: customer.customer_id}, this.fetchQueryDefaultOptions);
            const token = createToken(customerDetails);

            return res.status(201).json(
                {customer: {schema: customerDetails}, accessToken: token, expiresIn: jwtExpires});
        } catch (e) {
            next(e)
        }
    }

    public async updateAddress(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._updateCustomerAddressSchema, {unknownProperties: 'error'});
            const customerLookUp = {customer_id: req.user.id};
            const updateKwargs = {...req.body, ...customerLookUp};
            const customerDetails = await this.performCustomQuery(
                'customer_get_customer', customerLookUp, this.fetchQueryDefaultOptions);
            for (let [field, schema] of Object.entries(this._updateCustomerAddressSchema.properties)) {
                if (!get(schema, 'required', false) && !has(updateKwargs, field)) {
                    if (has(customerDetails, field)) {
                        updateKwargs[field] = customerDetails[field];
                    }
                }
            }
            await this.performCustomQuery('customer_update_address',
                {...updateKwargs, ...customerLookUp});
            const updatedCustomer = {...customerDetails, ...updateKwargs};
            return res.json(updatedCustomer);
        } catch (e) {
            next(e)
        }
    }

     public async updateCreditCard(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._updateCustomerCreditCardSchema, {unknownProperties: 'error'});
            const customerLookUp = {customer_id: req.user.id};
            const updateKwargs = {...req.body, ...customerLookUp};
            const customerDetails = await this.performCustomQuery(
                'customer_get_customer', customerLookUp, this.fetchQueryDefaultOptions);

            await this.performCustomQuery('customer_update_credit_card',
                {...updateKwargs, ...customerLookUp});
            const updatedCustomer = {...customerDetails, ...updateKwargs};
            return res.json(updatedCustomer);
        } catch (e) {
            next(e)
        }
    }
}
