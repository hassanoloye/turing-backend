import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";

const procedureNames: IProcedureNames = {
    getAll: 'catalog_get_tax_list',
    get: 'catalog_get_tax_details'
};

export default class TaxController extends BaseController {
    public routesConfig: IRouteConfig[] = [{
        method: 'get',
        fnName: 'getAll',
        relPath: '',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'get',
        relPath: '/:tax_id/',
        middlewares: [],
    }];

    constructor() {
        super({
            procedureNames: procedureNames
        });
    }
}
