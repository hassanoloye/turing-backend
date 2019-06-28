import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {NextFunction, Request, Response} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {numberAndRequired, stringAndRequired, validate} from "../../services/validator";
import {queryActionTypes} from "../../shared/interface/custom-query-option";
import {orderIdNumberExpected} from "../../middlewares/paramsValidator.middleware";


export default class OrdersController extends BaseController {
    public routesConfig: IRouteConfig[] = [{
        method: 'post',
        fnName: 'create',
        relPath: '/',
        middlewares: [
            authMiddleware,
        ],
    }, {
        method: 'get',
        fnName: 'getCustomerOrders',
        relPath: '/inCustomer',
        middlewares: [
            authMiddleware,
        ],
    }, {
        method: 'get',
        fnName: 'get',
        relPath: '/:order_id',
        middlewares: [
            authMiddleware,
            orderIdNumberExpected,
        ],
    }, {
        method: 'get',
        fnName: 'getOrderShortDetail',
        relPath: '/inOrder/shortDetail/:order_id',
        middlewares: [
            authMiddleware,
            orderIdNumberExpected,
        ],
    }];
    public modelName = 'order';
    public modelLookUpField = 'order_id';
    private _createOrderSchema = {
        properties: {
            cart_id: stringAndRequired,
            shipping_id: numberAndRequired,
            tax_id: numberAndRequired,
        }
    };

    constructor() {
        super({});
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._createOrderSchema, {unknownProperties: 'error'});
            const order = await this.performCustomQuery(
                'shopping_cart_create_order', {...req.body, ...{customer_id: req.user.id}},
                {action: queryActionTypes.CREATE});
            return res.json(order)
        } catch (e) {
            next(e)
        }
    }

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await this.performCustomQuery(
                'orders_get_order_details', req.params, this.fetchQueryDefaultOptions);
            return res.json(order)
        } catch (e) {
            next(e)
        }
    }

    async getCustomerOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const customerOrders = await this.performCustomQuery(
                'orders_get_by_customer_id', {customer_id: req.user.id});
            return res.json(customerOrders)
        } catch (e) {
            next(e)
        }
    }

    async getOrderShortDetail(req: Request, res: Response, next: NextFunction) {
        try {
            const orderShortDetail = await this.performCustomQuery(
                'orders_get_order_short_details', req.params, this.fetchQueryDefaultOptions);
            return res.json(orderShortDetail)
        } catch (e) {
            next(e)
        }
    }
}
