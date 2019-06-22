import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";
import {NextFunction, Request, Response} from "express";

const procedureNames: IProcedureNames = {
    getAll: 'catalog_get_attributes',
    get: 'catalog_get_attribute_details'
};

export default class AttributesController extends BaseController {
    public routesConfig: IRouteConfig[] = [{
        method: 'get',
        fnName: 'getAll',
        relPath: '',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'get',
        relPath: '/:attribute_id/',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getAttributeValues',
        relPath: '/values/:attribute_id',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getProductAttributes',
        relPath: '/inProduct/:product_id',
        middlewares: [],
    }];

    constructor() {
        super({
            procedureNames: procedureNames
        });
    }

    async getAttributeValues(req: Request, res: Response, next: NextFunction) {
        try {
            const attributeValues = await this.performCustomQuery(
                'catalog_get_attribute_values', req.params);
            return res.json(attributeValues)
        } catch (e) {
            next(e)
        }
    }

    async getProductAttributes(req: Request, res: Response, next: NextFunction) {
        try {
            const productAttributes = await this.performCustomQuery(
                'catalog_get_product_attributes', req.params);
            return res.json(productAttributes)
        } catch (e) {
            next(e)
        }
    }
}
