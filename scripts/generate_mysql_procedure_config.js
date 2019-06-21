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
const procedureConfigPath = path.join(baseDir, '/src/config/procedures.json');
const proceduresConfig = {};
const parametersSelectFields = ['SPECIFIC_NAME', 'PARAMETER_MODE', 'PARAMETER_NAME', 'DATA_TYPE',
    'CHARACTER_MAXIMUM_LENGTH', 'NUMERIC_PRECISION'].join(',')

function getJavascriptType(dbType) {
    return {
        "varchar": "string",
        "char": "string",
        "int": "number"
    }[dbType] || "string";
}

function getInputName(dbName) {
    return _.camelCase(dbName && dbName.replace(/^in/, ''))
}

const getParametersConfig = (parameters) => {
    const fields = {};
    for (const parameter of parameters) {
        if (parameter.PARAMETER_MODE === "IN") {
            const inputName = getInputName(parameter.PARAMETER_NAME);
            fields[inputName] = {
                dbType: parameter.DATA_TYPE,
                type: getJavascriptType(parameter.DATA_TYPE),
                name: inputName,
                dbName: parameter.PARAMETER_NAME,
                maxLength: parameter.CHARACTER_MAXIMUM_LENGTH
            }
        }
    }

    return {
        fields,
        parameters: Object.keys(fields)
    }
}

const writeToConfigFile = (proceduresConfig) => {
    fs.writeFile(procedureConfigPath, JSON.stringify(proceduresConfig, null, 4), 'utf8', (err) => {
        if (err) {
            console.log(`An error occurred while generating procedures configuration: Error ${err}`)
        } else {
            console.log("Successfully generated and stored procedures configuration")
        }
    });
}

async function generateMysqlProcedureConfig() {
    try {
        const getAllProcedureQuery = `SELECT name FROM mysql.proc WHERE Db="${sequelize.config.database}"`;
        console.log("Start querying for all procedures")
        const [procedures] = await sequelize.query(getAllProcedureQuery);
        console.log("Successfully queried all procedures")
        for (const procedure of procedures) {
            const qetParmetersQuery = `SELECT ${parametersSelectFields} FROM information_schema.parameters WHERE 
              SPECIFIC_NAME='${procedure.name}' AND ROUTINE_TYPE='PROCEDURE' ORDER BY ORDINAL_POSITION ASC`;
            console.log(`Start querying details for procedure: ${procedure.name}`)
            const [parameters] = await sequelize.query(qetParmetersQuery);

            console.log(`Successfully queried details for procedure: ${procedure.name}`)
            proceduresConfig[procedure.name] = getParametersConfig(parameters);
            console.log(`Successfully generated config for procedure: ${procedure.name}`)
        }
        writeToConfigFile(proceduresConfig)
    } catch (e) {
        console.error(`An error occurred. Error: ${e}`)
    }
}

generateMysqlProcedureConfig();
