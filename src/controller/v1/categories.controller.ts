import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";
import {NextFunction, Request, Response} from "express";
import {
    categoryIdNumberExpected,
    departmentIdNumberExpected,
    departmentWithIdExist,
    productIdNumberExpected,
    productWithIdExist
} from "../../middlewares/paramsValidator.middleware";
import {conformToOneOf, numberAndNotRequired, stringAndNotRequired, validate} from "../../services/validator";

const procedureNames: IProcedureNames = {
    getAll: 'catalog_get_categories',
    get: 'catalog_get_category_details'
};
const defaultRequestParams = {
    limit: 20,
    page: 1,
    order: 'category_id'
};
const categoryOrderFields = ['category_id', 'name'];

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
        middlewares: [
            categoryIdNumberExpected,
        ],
    }, {
        method: 'get',
        fnName: 'getProductCategories',
        relPath: '/inProduct/:product_id',
        middlewares: [
            productIdNumberExpected,
            productWithIdExist,
        ],
    }, {
        method: 'get',
        fnName: 'getDepartmentCategories',
        relPath: '/inDepartment/:department_id',
        middlewares: [
            departmentIdNumberExpected,
            departmentWithIdExist
        ],
    }];

    private _getCategoriesParamsSchema = {
        properties: {
            order: {
                ...stringAndNotRequired,
                ...conformToOneOf(categoryOrderFields)
            },
            page: numberAndNotRequired,
            limit: numberAndNotRequired,
        }
    };
    public modelName = 'category';
    public modelLookUpField = 'category_id';

    constructor() {
        super({
            procedureNames: procedureNames
        });
    }


    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.query, this._getCategoriesParamsSchema, {unknownProperties: 'error'});
            const replaceFields = {
                limit: 'categories_per_page',
                order: 'order_by',
            };
            const {kwargs, queryKwargs} = this.getQueryKwargsFromRequest(
                req,
                defaultRequestParams,
                {
                    fields: ['order', 'limit', 'page'],
                    replaceFields
                }
            );
            const rows = await this.performCustomQuery('catalog_get_categories', queryKwargs);
            const total = await this.performCustomQueryCount('catalog_count_categories', req.params);
            return res.json(this.getPaginatedResult(rows, total, kwargs, replaceFields))
        } catch (e) {
            next(e)
        }
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
