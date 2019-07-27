import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";
import {departmentIdNumberExpected} from "../../middlewares/paramsValidator.middleware";

const procedureNames: IProcedureNames = {
    getAll: 'catalog_get_departments',
    get: 'catalog_get_department_details'
};

export default class DepartmentsController extends BaseController {
    public routesConfig: IRouteConfig[] = [{
        method: 'get',
        fnName: 'getAll',
        relPath: '',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'get',
        relPath: '/:department_id/',
        middlewares: [
            departmentIdNumberExpected,
        ],
    }];
    public modelName = 'department';
    public modelLookUpField = 'department_id';

    constructor() {
        super({
            procedureNames: procedureNames
        });
    }
}
