import {IRouteConfig} from "../../shared/interface/route-config";
import {NextFunction, Request, Response} from "express";
import uuidv4 from 'uuid/v4';
import {numberAndRequired, stringAndRequired, validate} from "../../services/validator";
import BaseController from "./base.controller";
import {
    shoppingCartItemIdNumberExpected,
    shoppingCartWithCartIdExist,
    shoppingCartWithItemIdExist
} from "../../middlewares/paramsValidator.middleware";

export default class ShoppingCartController extends BaseController {
    public routesConfig: IRouteConfig[] = [{
        method: 'get',
        fnName: 'generateUniqueId',
        relPath: '/generateUniqueId',
        middlewares: [],
    }, {
        method: 'post',
        fnName: 'addProductToCart',
        relPath: '/add',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getProductsInCart',
        relPath: '/:cart_id',
        middlewares: [
            shoppingCartWithCartIdExist,
        ],
    }, {
        method: 'put',
        fnName: 'updateCartItem',
        relPath: '/update/:item_id',
        middlewares: [
            shoppingCartItemIdNumberExpected,
            shoppingCartWithItemIdExist,
        ],
    }, {
        method: 'delete',
        fnName: 'emptyCart',
        relPath: '/empty/:cart_id',
        middlewares: [
            shoppingCartWithCartIdExist
        ],
    }, {
        method: 'get',
        fnName: 'moveToCart',
        relPath: '/moveToCart/:item_id',
        middlewares: [
            shoppingCartItemIdNumberExpected,
            shoppingCartWithItemIdExist
        ],
    }, {
        method: 'get',
        fnName: 'getTotalAmount',
        relPath: '/totalAmount/:cart_id',
        middlewares: [
            shoppingCartWithCartIdExist
        ],
    }, {
        method: 'get',
        fnName: 'saveForLater',
        relPath: '/saveForLater/:item_id',
        middlewares: [
            shoppingCartItemIdNumberExpected,
            shoppingCartWithItemIdExist
        ],
    }, {
        method: 'get',
        fnName: 'getSavedForLaterProducts',
        relPath: '/getSaved/:cart_id',
        middlewares: [
            shoppingCartWithCartIdExist
        ],
    }, {
        method: 'get',
        fnName: 'removeProductFromCart',
        relPath: '/removeProduct/:item_id',
        middlewares: [
            shoppingCartItemIdNumberExpected,
            shoppingCartWithItemIdExist
        ],
    }];
    private _addProductToCartSchema = {
        properties: {
            cart_id: stringAndRequired,
            product_id: numberAndRequired,
            attributes: stringAndRequired,
        }
    };
    private _updateCartItemSchema = {
        properties: {
            quantity: {
                ...numberAndRequired,
                minimum: 0,
            },
        }
    };

    constructor() {
        super({});
    }


    public async generateUniqueId(req: Request, res: Response, next: NextFunction) {
        try {
            const uniqueId = uuidv4().replace(/-/g, '',).slice(0, 30)
            return res.json({cart_id: uniqueId})
        } catch (e) {
            next(e)
        }
    }

    public async addProductToCart(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._addProductToCartSchema, {unknownProperties: 'error'});
            await this.performCustomQuery('shopping_cart_add_product', req.body);
            const cartProducts = await this.performCustomQuery(
                'shopping_cart_get_products', {cart_id: req.body.cart_id});
            return res.json(cartProducts)
        } catch (e) {
            next(e)
        }
    }

    public async getProductsInCart(req: Request, res: Response, next: NextFunction) {
        try {
            const cartProducts = await this.performCustomQuery(
                'shopping_cart_get_products', req.params);
            return res.json(cartProducts)
        } catch (e) {
            next(e)
        }
    }

    public async updateCartItem(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._updateCartItemSchema, {unknownProperties: 'error'});
            const cartProducts = await this.performCustomQuery(
                'shopping_cart_update', {...req.body, ...req.params});
            // TODO: Return list of products in carts
            return res.json(cartProducts)
        } catch (e) {
            next(e)
        }
    }

    public async emptyCart(req: Request, res: Response, next: NextFunction) {
        try {
            await this.performCustomQuery('shopping_cart_empty', req.params);
            return res.json([]);
        } catch (e) {
            next(e)
        }
    }

    public async moveToCart(req: Request, res: Response, next: NextFunction) {
        try {
            await this.performCustomQuery('shopping_cart_move_product_to_cart', req.params);
            return res.json({});
        } catch (e) {
            next(e)
        }
    }

    public async getTotalAmount(req: Request, res: Response, next: NextFunction) {
        try {
            const [total_amount] = await this.performCustomQuery(
                'shopping_cart_get_total_amount',
                req.params);
            return res.json(total_amount);
        } catch (err) {
            next(err)
        }
    }

    public async saveForLater(req: Request, res: Response, next: NextFunction) {
        try {
            await this.performCustomQuery('shopping_cart_save_product_for_later',
                req.params);
            // TODO: Return list of products in carts
            return res.json({});
        } catch (err) {
            next(err)
        }
    }

    public async getSavedForLaterProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await this.performCustomQuery('shopping_cart_get_saved_products',
                req.params);
            return res.json(products);
        } catch (err) {
            next(err)
        }
    }

    public async removeProductFromCart(req: Request, res: Response, next: NextFunction) {
        try {
            await this.performCustomQuery('shopping_cart_remove_product',
                req.params);
            return res.json({});
        } catch (err) {
            next(err)
        }
    }
}
