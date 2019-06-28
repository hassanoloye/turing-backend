import {NextFunction, Request, Response} from "express";
import {notExpectedTypeErrorCodes, notFoundErrorCodes} from "../shared/errorCodes";
import sequelize from "../setup/sequelize.setup";

const getNormalizedParamValue = (value: string, expectedType: string) => {
    if (expectedType === 'number') {
        const numberValue = Number(value);
        if (!isNaN(numberValue)) {
            return numberValue;
        }
    }

    return value;
};

export const isExpectedType = (recordName: string, expectedType: string, fieldName: string, shortFieldName?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.params[fieldName] && typeof (getNormalizedParamValue(req.params[fieldName], expectedType)) === expectedType) {
            next()
        } else {
            return res.status(400).json({error: notExpectedTypeErrorCodes(recordName, expectedType, fieldName, shortFieldName)});
        }
    }
};

export const recordExist = (recordName: string, lookUpKey: string, shortLookUpField?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const lookUpValue = req.params[lookUpKey];
        const [record]: any[] = await sequelize.query(`SELECT ${lookUpKey} FROM ${recordName} 
          WHERE ${lookUpKey}="${lookUpValue}" LIMIT 1`);
        if (record && record[0]) {
            next()
        } else {
            return res.status(404).json({error: notFoundErrorCodes(recordName, lookUpKey, shortLookUpField)});
        }
    }
};

export const attributeIdNumberExpected = isExpectedType('attribute', 'number', 'attribute_id', 'id');
export const categoryIdNumberExpected = isExpectedType('category', 'number', 'category_id', 'id');
export const departmentIdNumberExpected = isExpectedType('department', 'number', 'department_id', 'id');
export const orderIdNumberExpected = isExpectedType('order', 'number', 'order_id', 'id');
export const productIdNumberExpected = isExpectedType('product', 'number', 'product_id', 'id');
export const shoppingCartItemIdNumberExpected = isExpectedType('shopping_cart', 'number', 'item_id');
export const taxIdNumberExpected = isExpectedType('tax', 'number', 'tax_id', 'id');
export const shippingRegionIdNumberExpected = isExpectedType('shipping_region', 'number', 'shipping_region_id', 'id');

export const attributeWithIdExist = recordExist('attribute', 'attribute_id', 'id');
export const categoryWithIdExist = recordExist('category', 'category_id', 'id');
export const departmentWithIdExist = recordExist('department', 'department_id', 'id');
export const orderWithIdExist = recordExist('order', 'order_id', 'id');
export const productWithIdExist = recordExist('product', 'product_id', 'id');
export const shoppingCartWithItemIdExist = recordExist('shopping_cart', 'item_id',);
export const shoppingCartWithCartIdExist = recordExist('shopping_cart', 'cart_id',);
