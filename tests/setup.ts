import dotenv from "dotenv";
import * as path from "path";

const baseDir = path.resolve(__dirname, './../');
dotenv.config({path: path.join(baseDir, ".test.env")});
import sequelize from "./../src/setup/sequelize.setup"

const tableNames = [
    'department',
    'category',
    'product',
    'product_category',
    'attribute',
    'attribute_value',
    'product_attribute'
];

before(async () => {
    await Promise.all(tableNames.map(async (table) => {
        await sequelize.query(`DELETE FROM ${table};`)
    }))
});
