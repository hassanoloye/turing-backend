import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";
import {taxIdNumberExpected} from "../../middlewares/paramsValidator.middleware";

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
        middlewares: [
            taxIdNumberExpected
        ],
    }];
    public modelName = 'tax';
    public modelLookUpField: string = 'tax_id';

    constructor() {
        super({
            procedureNames: procedureNames
        });
    }
}
