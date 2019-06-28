import BaseController from "./base.controller";
import {IRouteConfig} from "../../shared/interface/route-config";
import {IProcedureNames} from "../../shared/interface/procedureNames";
import {shippingRegionIdNumberExpected} from "../../middlewares/paramsValidator.middleware";

const procedureNames: IProcedureNames = {
    getAll: 'customer_get_shipping_regions',
    get: 'orders_get_shipping_info'
};

export default class ShippingController extends BaseController {
    public routesConfig: IRouteConfig[] = [{
        method: 'get',
        fnName: 'getAll',
        relPath: '/regions',
        middlewares: [],
    }, {
        method: 'get',
        fnName: 'get',
        relPath: '/regions/:shipping_region_id',
        middlewares: [
            shippingRegionIdNumberExpected
        ],
    }];
    public modelName = 'shipping_region';
    public modelLookUpField = 'shipping_region_id';


    constructor() {
        super({
            procedureNames: procedureNames
        });
    }
}
