import {tablesConfig, proceduresConfig} from "../src/config";
import sequelize from "../src/setup/sequelize.setup"

const insertRecordToProcedureNamesMap = {
    'department': 'catalog_add_department',
    'category': 'catalog_add_category',
    'product': 'catalog_add_product_to_category',
    'product_category': 'catalog_assign_product_to_category',
    'attribute': 'catalog_add_attribute',
    'attribute_value': 'catalog_add_attribute_value',
    'product_attribute': 'catalog_assign_attribute_value_to_product',
};

export const insertRecord = async (tableName: string, values: any = {}) => {
    const procedureName = insertRecordToProcedureNamesMap[tableName];
    const procedureConfig = proceduresConfig[procedureName];
    const procedureParameters = procedureConfig && procedureConfig.parameters;
    const procedureArgs = procedureParameters && procedureParameters.length ?
        procedureParameters.map((parameter: string) => `"${values[parameter]}"`) : Object.values(values);
    const procedureArgsCallString = procedureArgs.length ? `(${procedureArgs.join(",")})` : '';
    await sequelize.query(`CALL ${procedureName}${procedureArgsCallString}`);
    const primaryKeys = tablesConfig[tableName] && tablesConfig[tableName].primaryKeys;
    const castedPrimaryKeys = primaryKeys && primaryKeys.map((pk: string) => `CAST(${pk} AS UNSIGNED) DESC`);
    const orderByPrimaryKeysQuery = castedPrimaryKeys ? `ORDER BY ${castedPrimaryKeys.join(", ")}` : '';
    const selectLastInsertedQuery = `SELECT * FROM ${tableName} ${orderByPrimaryKeysQuery} LIMIT 1`;

    const [rows]: any[] = await sequelize.query(selectLastInsertedQuery);
    return rows && rows[0];
};
