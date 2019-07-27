import {NextFunction, Request, Response} from "express";
import {IRouteConfig} from "../../shared/interface/route-config";
import {emailRequired, stringAndNotRequired, stringAndRequired, validate} from "../../services/validator";
import {hashPassword} from "../../shared/utils/account.utils";
import BaseController from "./base.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import {get, has} from "lodash";


export default class CustomerController extends BaseController {
    constructor() {
        super({});
    }

    public routesConfig: IRouteConfig[] = [{
        method: 'get',
        fnName: 'get',
        relPath: '/',
        middlewares: [authMiddleware],
    }, {
        method: 'put',
        fnName: 'update',
        relPath: '/',
        middlewares: [authMiddleware],
    }];

    private _updateCustomerSchema = {
        properties: {
            name: stringAndRequired,
            email: emailRequired,
            password: {
                ...stringAndRequired,
                minLength: 6,
                required: false,
            },
            day_phone: stringAndNotRequired,
            eve_phone: stringAndNotRequired,
            mob_phone: stringAndNotRequired,
        }
    };

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._updateCustomerSchema, {unknownProperties: 'error'});
            const customerLookUp = {customer_id: req.user.id};
            const updateKwargs = {...req.body, ...customerLookUp};
            if (has(updateKwargs, 'password')) {
                updateKwargs.password = hashPassword(updateKwargs.password)
            }
            const customerDetails = await this.performCustomQuery(
                'customer_get_customer', customerLookUp, this.fetchQueryDefaultOptions);
            for (let [field, schema] of Object.entries(this._updateCustomerSchema.properties)) {
                if (!get(schema, 'required', false) && !has(updateKwargs, field)) {
                    if (has(customerDetails, field)) {
                        updateKwargs[field] = customerDetails[field];
                    }
                }
            }
            await this.performCustomQuery('customer_update_account',
                {...updateKwargs, ...customerLookUp});
            const updatedCustomer = {...customerDetails, ...updateKwargs};

            delete updatedCustomer.password;
            return res.json(updatedCustomer);
        } catch (e) {
            next(e)
        }
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const customerLookUp = {customer_id: req.user.id};
            const customerDetails = await this.performCustomQuery(
                'customer_get_customer', customerLookUp, this.fetchQueryDefaultOptions);
            delete customerDetails.password;
            return res.json(customerDetails);
        } catch (e) {
            next(e)
        }
    }
}
