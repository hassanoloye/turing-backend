import {NextFunction, Request, Response} from "express";
import CRUDMixin from "../../mixin/crud.mixin";
import {ICustomQueryOption, queryActionTypes} from "../../shared/interface/custom-query-option";
import {notFoundErrorCodes} from "../../shared/errorCodes";
import {get, has} from "lodash";
import {CustomApiError} from "../../shared/utils/error.util";


export default class BaseController {

    public modelName: string = 'record';
    public modelLookUpField: string = '';
    public modelShortLookUpField: string = 'id';

    private _crudMixin: CRUDMixin;

    constructor(args: any) {
        this._crudMixin = new CRUDMixin({
            procedureNames: args.procedureNames,
        })
    }

    public fetchQueryDefaultOptions: ICustomQueryOption = {
        firstOnly: true,
        action: queryActionTypes.FETCH,
    };


    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const record = await this._crudMixin.get(req.params);
            this._throwNotFoundIfNotExist(record, {modelName: this.modelName});
            return res.json(record)
        } catch (e) {
            next(e)
        }
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this._crudMixin.getAll();
            return res.json(data);
        } catch (e) {
            next(e)
        }
    }

    public async performCustomQuery(procedureName: string, procedureKwargs: any, options: ICustomQueryOption = {}) {
        const data = await this._crudMixin.queryProcedure(procedureName, procedureKwargs, options);
        if (options.firstOnly && options.action === queryActionTypes.FETCH) {
            this._throwNotFoundIfNotExist(data, options)
        }

        return data;
    }

    public async performCustomQueryCount(procedureName: string, procedureKwargs: any) {
        const [resp]: any[] = await this._crudMixin.queryProcedure(procedureName, procedureKwargs);
        return Object.values(resp)[0];
    }

    public getQueryKwargsFromRequest(req: Request,
                                     defaultRequestParams: any,
                                     {
                                         fields = ['limit', 'description_length', 'page'],
                                         replaceFields = {}
                                     }) {
        const kwargs: any = {};
        for (const field of fields) {
            const mappedField = replaceFields[field] || field;
            kwargs[mappedField] = get(req.query, field, defaultRequestParams[field]);
        }

        if (fields.includes('page') && fields.includes('limit')) {
            const limitField = replaceFields['limit'] || 'limit';
            if (has(kwargs, limitField)) {
                kwargs.page = Number(kwargs.page);
                kwargs[limitField] = Number(kwargs[limitField]);
                kwargs.start_item = (kwargs.page - 1) * kwargs[limitField];
            }
        }
        const queryKwargs = {...kwargs};
        delete queryKwargs.page;

        return {kwargs, queryKwargs};
    }

    public getPaginatedResult(rows: any[], total: any, kwargs: any, replaceFields: any) {
        return {
            count: rows.length,
            rows,
            total,
            page: kwargs.page,
            limit: kwargs.limit || kwargs[replaceFields.limit]
        }
    }

    private _throwNotFoundIfNotExist(record: any, options: ICustomQueryOption) {
        if (!record) {
            throw new CustomApiError(404, notFoundErrorCodes(
                options.modelName || this.modelName,
                options.modelLookUpField || this.modelLookUpField,
                options.modelShortLookUpField || this.modelShortLookUpField));
        }
    }


}

