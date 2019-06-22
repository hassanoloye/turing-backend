import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";
import {NextFunction, Request, Response} from "express";

const procedureNames: IProcedureNames = {
    getAll: 'catalog_get_categories',
    get: 'catalog_get_category_details'
};

export default class CategoriesController extends BaseController {
    public routesConfig: IRouteConfig[] = [{
        method: 'get',
        fnName: 'getAll',
        relPath: '',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'get',
        relPath: '/:category_id',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getProductCategories',
        relPath: '/inProduct/:product_id',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getDepartmentCategories',
        relPath: '/inDepartment/:department_id',
        middlewares: [],
    }];

    constructor() {
        super({
            procedureNames: procedureNames
        });
    }

    async getProductCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const productCategories = await this.performCustomQuery(
                'catalog_get_categories_for_product', req.params);
            return res.json(productCategories)
        } catch (e) {
            next(e)
        }
    }

    async getDepartmentCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const departmentCategories = await this.performCustomQuery(
                'catalog_get_department_categories', req.params);
            return res.json(departmentCategories)
        } catch (e) {
            next(e)
        }
    }
}
