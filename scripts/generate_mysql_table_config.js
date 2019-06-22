const dotenv = require("dotenv")
const path = require("path");
dotenv.config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false
});
const fs = require('fs');
const _ = require("lodash")


const baseDir = path.resolve(__dirname, '../')
const tableConfigPath = path.join(baseDir, '/src/config/tables.json');
const tablesConfig = {};

const writeToConfigFile = (proceduresConfig) => {
    fs.writeFile(tableConfigPath, JSON.stringify(proceduresConfig, null, 4), 'utf8', (err) => {
        if (err) {
            console.log(`An error occurred while generating tables configuration: Error ${err}`)
        } else {
            console.log("Successfully generated and stored tables configuration")
        }
    });
}

async function generateMysqlTablesConfig() {
    try {
        console.log("Start querying for all tables")
        const [tables] = await sequelize.query(`SELECT TABLE_NAME AS name FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='${sequelize.config.database}'`);
        console.log("Successfully queried all tables", tables)
        for (const table of tables) {
            const config = {}
            const [primaryKeys] = await sequelize.query(`SELECT COLUMN_NAME AS name FROM information_schema.COLUMNS WHERE 
              TABLE_SCHEMA = '${sequelize.config.database}' AND TABLE_NAME = '${table.name}' AND (COLUMN_KEY = 'PRI')`);
            console.log(`Start querying details for table: ${table.name}`)
            config.primaryKeys = primaryKeys.map((pk) => pk.name)
            tablesConfig[table.name] = config;
            console.log(`Successfully generated config for table: ${table.name}`)
        }
        writeToConfigFile(tablesConfig)
    } catch (e) {
        console.error(`An error occurred. Error: ${e}`)
    }
}

generateMysqlTablesConfig();
