import {Request, Response, NextFunction} from "express";
import CRUDMixin from "../../mixin/crud.mixin";
import createError from "http-errors";
import sequelize from "../../setup/sequelize.setup";
import {ICustomQueryOption, queryActionTypes} from "../../shared/interface/custom-query-option";

export default class BaseController {

    public routeSlug: string = '';
    private _crudMixin: CRUDMixin;

    constructor(args: any) {
        this._crudMixin = new CRUDMixin({
            procedureNames: args.procedureNames,
        })
    }

    private _prepareLookupKwargs(req: Request) {
        return {...req.params};
    }

    public fetchQueryDefaultOptions: ICustomQueryOption = {
        firstOnly: true,
        action: queryActionTypes.FETCH
    };


    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const lookupKwargs = this._prepareLookupKwargs(req);
            const record = await this._crudMixin.get(lookupKwargs);
            if (record) {
                return res.json(record)
            } else {
                throw createError(404, "record does not exist");
            }
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

    public async performCustomQuery (procedureName: string, procedureKwargs: any, options: ICustomQueryOption = {}) {
        const data = await this._crudMixin.queryProcedure(procedureName, procedureKwargs, options);
        if (options.firstOnly && options.action === queryActionTypes.FETCH) {
            this.validateRecord(data, options)
        }

        return data;
    }

    public async performCustomQueryCount (procedureName: string, procedureKwargs: any) {
        const [resp]: any[] = await this._crudMixin.queryProcedure(procedureName, procedureKwargs);
        return Object.values(resp)[0];
    }

    public async getTableRecords(tableName: string, columnNames: string[]) {
        const [rows]: any[] = await sequelize.query(`SELECT ${columnNames} FROM ${tableName}`);
        return rows;
    }

    public getInsertedRecordDetails(insertedRecord: any, createKwargs: any) {

    }

    public validateRecord(record: any, options: ICustomQueryOption) {
        if (!record) {
            throw createError(404, `${options.modelName || 'Record'} does not exist`);
        }
    }
}

