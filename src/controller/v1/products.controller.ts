import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";
import {NextFunction, Request, Response} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
    numberAndNotRequired,
    numberAndRequired,
    stringAndNotRequired,
    stringAndRequired,
    validate
} from "../../services/validator";
import {queryActionTypes} from "../../shared/interface/custom-query-option";
import {
    categoryIdNumberExpected,
    categoryWithIdExist,
    departmentIdNumberExpected,
    departmentWithIdExist,
    productIdNumberExpected,
    productWithIdExist
} from "../../middlewares/paramsValidator.middleware";

const procedureNames: IProcedureNames = {
    get: 'catalog_get_product_details'
};
const productSearchFields = ['query_string', 'all_words', 'page', 'limit', 'description_length'];
const defaultRequestParams = {
    limit: 20,
    description_length: 200,
    all_words: 'on',
    page: 1,
};

export default class ProductsController extends BaseController {
    public routesConfig: IRouteConfig[] = [{
        method: 'get',
        fnName: 'getAll',
        relPath: '',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'search',
        relPath: '/search/',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'get',
        relPath: '/:product_id/',
        middlewares: [
            productIdNumberExpected
        ],
    }, {
        method: 'get',
        fnName: 'getProductsInCategory',
        relPath: '/inCategory/:category_id',
        middlewares: [
            categoryIdNumberExpected,
            categoryWithIdExist,
        ],
    }, {
        method: 'get',
        fnName: 'getProductsOnDepartment',
        relPath: '/inDepartment/:department_id',
        middlewares: [
            departmentIdNumberExpected,
            departmentWithIdExist,
        ],
    }, {
        method: 'get',
        fnName: 'getProductDetails',
        relPath: '/:product_id/details',
        middlewares: [
            productIdNumberExpected,
            productWithIdExist
        ],
    }, {
        method: 'get',
        fnName: 'getProductLocations',
        relPath: '/:product_id/locations',
        middlewares: [
            productIdNumberExpected
        ],
    }, {
        method: 'get',
        fnName: 'getProductReviews',
        relPath: '/:product_id/reviews',
        middlewares: [
            productIdNumberExpected
        ],
    }, {
        method: 'post',
        fnName: 'createProductReview',
        relPath: '/:product_id/reviews',
        middlewares: [
            authMiddleware,
            productIdNumberExpected,
        ],
    }];
    public modelName = 'product';
    public modelLookUpField = 'product_id';

    private _searchProductsSchema = {
        properties: {
            query_string: stringAndRequired,
            all_words: stringAndNotRequired,
            page: numberAndNotRequired,
            limit: numberAndNotRequired,
            description_length: stringAndNotRequired,
        }
    };

    private _reqQuerySchema = {
        properties: {
            page: numberAndNotRequired,
            limit: numberAndNotRequired,
            description_length: numberAndNotRequired,
        }
    };
    private _productsInCategoryReqQuerySchema = this._reqQuerySchema;
    private _productsOnDepartmentReqQuerySchema = this._reqQuerySchema;
    private _createProductReviewSchema = {
        properties: {
            review: stringAndRequired,
            rating: {
                ...numberAndRequired,
                maximum: 5,
                minimum: 1,
            }
        }
    };
    private _getProductsParamsSchema = {
        properties: {
            page: numberAndNotRequired,
            limit: numberAndNotRequired,
            description_length: numberAndNotRequired,
        }
    };
    private _defaultPaginationReplaceFields = {
        limit: 'products_per_page',
        description_length: 'short_product_description_length'
    };

    constructor() {
        super({
            procedureNames: procedureNames,
        });
    }


    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.query, this._getProductsParamsSchema, {unknownProperties: 'error'});
            const {kwargs, queryKwargs} = this.getQueryKwargsFromRequest(req, defaultRequestParams,
                {replaceFields: this._defaultPaginationReplaceFields});
            const rows = await this.performCustomQuery('catalog_get_products_on_catalog', queryKwargs);
            const total = await this.performCustomQueryCount(
                'catalog_count_products_on_catalog', req.params);
            return res.json(this.getPaginatedResult(rows, total, kwargs, this._defaultPaginationReplaceFields))
        } catch (e) {
            next(e)
        }
    }

    public async search(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.query, this._searchProductsSchema, {unknownProperties: 'error'});
            const replaceFields = {
                ...this._defaultPaginationReplaceFields,
                query_string: 'search_string'
            };
            const {kwargs, queryKwargs} = this.getQueryKwargsFromRequest(
                req,
                defaultRequestParams,
                {
                    fields: ['query_string', 'all_words', 'limit', 'description_length', 'page'],
                    replaceFields
                }
            );

            const rows = await this.performCustomQuery('catalog_search', queryKwargs);
            const total = await this.performCustomQueryCount(
                'catalog_count_products_on_catalog', req.params);
            return res.json(this.getPaginatedResult(rows, total, kwargs, replaceFields))
        } catch (e) {
            next(e);
        }
    }

    public async getProductsInCategory(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.query, this._productsInCategoryReqQuerySchema, {unknownProperties: 'error'});
            const {kwargs, queryKwargs} = this.getQueryKwargsFromRequest(req, defaultRequestParams,
                {replaceFields: this._defaultPaginationReplaceFields});
            const rows = await this.performCustomQuery('catalog_get_products_in_category',
                {...queryKwargs, ...req.params});
            const total = await this.performCustomQueryCount(
                'catalog_count_products_in_category', req.params);
            return res.json(this.getPaginatedResult(rows, total, kwargs, this._defaultPaginationReplaceFields));
        } catch (e) {
            next(e);
        }
    }

    public async getProductsOnDepartment(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.query, this._productsOnDepartmentReqQuerySchema, {unknownProperties: 'error'});
            const {kwargs, queryKwargs} = this.getQueryKwargsFromRequest(req, defaultRequestParams,
                {replaceFields: this._defaultPaginationReplaceFields});
            const rows = await this.performCustomQuery('catalog_get_products_on_department',
                {...queryKwargs, ...req.params});
            const total = await this.performCustomQueryCount(
                'catalog_count_products_on_department', req.params);
            return res.json(this.getPaginatedResult(rows, total, kwargs, this._defaultPaginationReplaceFields));
        } catch (e) {
            next(e);
        }
    }

    public async getProductDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const record = await this.performCustomQuery(
                'catalog_get_product_details', req.params, this.fetchQueryDefaultOptions);
            return res.json(record);
        } catch (e) {
            next(e);
        }
    }

    public async getProductLocations(req: Request, res: Response, next: NextFunction) {
        try {
            const record = await this.performCustomQuery(
                'catalog_get_product_locations', req.params);
            return res.json(record);
        } catch (e) {
            next(e);
        }
    }

    public async getProductReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const record = await this.performCustomQuery(
                'catalog_get_product_reviews', req.params);
            return res.json(record);
        } catch (e) {
            next(e);
        }
    }

    public async createProductReview(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.body, this._createProductReviewSchema, {unknownProperties: 'error'});
            const createKwargs = {...req.body, ...req.params};
            createKwargs.customer_id = req.user.id;
            const record = await this.performCustomQuery(
                'catalog_create_product_review', createKwargs, {action: queryActionTypes.CREATE});
            return res.json(record);
        } catch (e) {
            next(e);
        }
    }
}
