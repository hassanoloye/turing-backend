import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";
import {NextFunction, Request, Response} from "express";
import {
    conformToOneOf,
    numberAndRequired,
    objectAndRequired,
    stringAndNotRequired,
    stringAndRequired,
    validate
} from "../../services/validator";
import {IS_DEV_MODE, stripeDefaultCurrency, stripeEndpointSecret} from "../../config";
import stripe from "../../setup/stripe.setup"
import currencyCodes from "../../shared/currencyCodes";

const procedureNames: IProcedureNames = {
    getAll: 'catalog_get_tax_list',
    get: 'catalog_get_tax_details'
};

export default class StripeController extends BaseController {
    public routesConfig: IRouteConfig[] = [{
        method: 'post',
        fnName: 'createCharge',
        relPath: '/charge',
        middlewares: [],
    }, {
        method: 'post',
        fnName: 'webhooks',
        relPath: '/webhooks',
        middlewares: [],
    }];
    private _createChargeSchema = {
        properties: {
            order_id: numberAndRequired,
            description: stringAndRequired,
            amount: numberAndRequired,
            currency: {
                ...stringAndNotRequired,
                minLength: 3,
                maxLength: 3,
                ...conformToOneOf(currencyCodes),
            }
        }
    };
    private _stripeWebhooksSchema = {
        properties: {
            type: stringAndRequired,
            data: {
                ...objectAndRequired,
                properties: {
                    object: objectAndRequired
                }
            },
        }
    };

    constructor() {
        super({
            procedureNames: procedureNames
        });
    }

    public async createCharge(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._createChargeSchema, {unknownProperties: 'error'});

            const charge = await stripe.charges.create({
                amount: req.body.amount,
                description: req.body.description,
                currency: req.body.currency || stripeDefaultCurrency,
                source: "tok_mastercard",
                metadata: {order_id: req.body.order_id}
            });
            return res.json(charge)
        } catch (err) {
            next(err);
        }

    }

    public async webhooks(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._stripeWebhooksSchema, {unknownProperties: 'error'});

            let event;
            if (IS_DEV_MODE) {
                event = req.body;
            } else {
                // Validate signature in production
                try {
                    const sig = req.headers['stripe-signature'];
                    event = await stripe.webhooks.constructEvent(req.body, sig, stripeEndpointSecret);
                } catch (err) {
                    return res.status(400).json({message: `Webhook Error: ${err.message}`});
                }
            }
            // Handle the event
            switch (event.type) {
                case 'charge.succeeded':
                    break;
                default:
                    // Unexpected event type
                    return res.status(400).send({message: `Unexpected event type: ${event.type}`});
            }

            // Return a response to acknowledge receipt of the event
            return res.json({received: true});
        } catch (err) {
            next(err);
        }
    }
}
