import {Request, Response, NextFunction} from "express";
import CRUDMixin from "../../mixin/crud.mixin";
import createError from "http-errors";

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


    public async get(req: Request, res: Response, next: NextFunction) {
        try {
            const lookupKwargs = this._prepareLookupKwargs(req);
            const data = await this._crudMixin.get(lookupKwargs);
            const record = data && data[0]
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
            return res.json(data)
        } catch (e) {
            next(e)
        }
    }

    public async performCustomQuery (procedureName: string, procedureKwargs: any) {
        return await this._crudMixin.queryProcedure(procedureName, procedureKwargs);
    }
}

