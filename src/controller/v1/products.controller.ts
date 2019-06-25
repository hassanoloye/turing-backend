import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";
import {Request, Response, NextFunction} from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import {
    numberAndNotRequired, numberAndRequired,
    phoneNumberRequired,
    stringAndNotRequired,
    stringAndRequired,
    validate
} from "../../services/validator";
import {get} from 'lodash';
import {queryActionTypes} from "../../shared/interface/custom-query-option";

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
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getProductsInCategory',
        relPath: '/inCategory/:category_id',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getProductsOnDepartment',
        relPath: '/inDepartment/:department_id',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getProductDetails',
        relPath: '/:product_id/details',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getProductLocations',
        relPath: '/:product_id/locations',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'getProductReviews',
        relPath: '/:product_id/reviews',
        middlewares: [],
    }, {
        method: 'post',
        fnName: 'createProductReview',
        relPath: '/:product_id/reviews',
        middlewares: [authMiddleware],
    }];

    constructor() {
        super({
            procedureNames: procedureNames,
        });
    }

    private _searchProductsSchema = {
        properties: {
            query_string: stringAndRequired,
            all_words: stringAndNotRequired,
            page: stringAndNotRequired,
            limit: stringAndNotRequired,
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

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const kwargs = {
                products_per_page: get(req.query, 'limit', defaultRequestParams.limit),
                start_item: get(req.query, 'page', defaultRequestParams.page),
                short_product_description_length: get(
                    req.query, 'description_length', defaultRequestParams.description_length)
            };
            const rows = await this.performCustomQuery('catalog_get_products_on_catalog', kwargs);
            const total = await this.performCustomQueryCount(
                'catalog_count_products_on_catalog', req.params);
            return res.json({count: rows.length, rows, total})
        } catch (e) {
            next(e)
        }
    }

    public async search(req: Request, res: Response, next: NextFunction) {
        try {
            // TODO: investigate why this is not working
            validate(req.query, this._searchProductsSchema, {unknownProperties: 'error'});
            const searchKwargs = {
                search_string: req.query.query_string,
                all_words: get(req.query, 'all_words', defaultRequestParams.all_words),
                start_item: get(req.query, 'page', defaultRequestParams.page),
                products_per_page: get(req.query, 'limit', defaultRequestParams.limit),
                short_product_description_length: get(
                    req.query, 'description_length', defaultRequestParams.description_length)
            };
            const data = await this.performCustomQuery('catalog_search', searchKwargs);
            const total = await this.performCustomQueryCount(
                'catalog_count_products_on_catalog', req.params);
            return res.json({data, count: data.length, total})
        } catch (e) {
            next(e);
        }
    }

    public async getProductsInCategory(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.query, this._productsInCategoryReqQuerySchema, {unknownProperties: 'error'});
            const kwargs = {
                ...req.params,
                products_per_page: get(req.query, 'limit', defaultRequestParams.limit),
                start_item: get(req.query, 'page', defaultRequestParams.page),
                short_product_description_length: get(
                    req.query, 'description_length', defaultRequestParams.description_length)
            };
            const data = await this.performCustomQuery('catalog_get_products_in_category', kwargs);
            const total = await this.performCustomQueryCount(
                'catalog_count_products_in_category', req.params);
            return res.json({data, count: data.length, total})
        }  catch (e) {
            next(e);
        }
    }

    public async getProductsOnDepartment(req: Request, res: Response, next: NextFunction) {
        try {
            validate(req.query, this._productsOnDepartmentReqQuerySchema, {unknownProperties: 'error'});
            const kwargs = {
                ...req.params,
                products_per_page: get(req.query, 'limit', defaultRequestParams.limit),
                start_item: get(req.query, 'page', defaultRequestParams.page),
                short_product_description_length: get(
                    req.query, 'description_length', defaultRequestParams.description_length)
            };
            const data = await this.performCustomQuery('catalog_get_products_on_department', kwargs);
            const total = await this.performCustomQueryCount(
                'catalog_count_products_on_department', req.params);
            return res.json({data, count: data.length, total})
        } catch (e) {
            next(e);
        }
    }

    public async getProductDetails (req: Request, res: Response, next: NextFunction) {
        try {
            const record = await this.performCustomQuery(
                'catalog_get_product_details', req.params, this.fetchQueryDefaultOptions);
            return res.json(record);
        } catch (e) {
            next(e);
        }
    }

    public async getProductLocations (req: Request, res: Response, next: NextFunction) {
        try {
            const record = await this.performCustomQuery(
                'catalog_get_product_locations', req.params);
            return res.json(record);
        } catch (e) {
            next(e);
        }
    }

    public async getProductReviews (req: Request, res: Response, next: NextFunction) {
        try {
            const record = await this.performCustomQuery(
                'catalog_get_product_reviews', req.params);
            return res.json(record);
        } catch (e) {
            next(e);
        }
    }

    public async createProductReview (req: Request, res: Response, next: NextFunction) {
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
