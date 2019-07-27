import {Sequelize} from "sequelize";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error('Database URL not provided')
}
const sequelize = new Sequelize(DATABASE_URL);

export default sequelize;
