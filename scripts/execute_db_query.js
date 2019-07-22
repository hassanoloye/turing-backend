const dotenv = require("dotenv")

const fs = require('fs');
const path = require('path');
const Sequelize = require("sequelize");
const baseDir = path.resolve(__dirname, './../');


const IS_TEST_MODE = process.env.NODE_ENV === 'test';
dotenv.config({path: path.join(baseDir, IS_TEST_MODE ? ".test.env" : ".env")});

const fileRelPath = IS_TEST_MODE ? 'tshirtshop.test.sql' : 'tshirtshop.sql';
const fileContents = fs.readFileSync(path.resolve(__dirname, '../database', fileRelPath), 'utf8')
const purifiedFileContents = fileContents.replace(/\r?\n|\r/g, ' ')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
    dialectOptions: {
        multipleStatements: true
    }
});

async function executeQuery() {
    try {
        await sequelize.query(fileContents)
        console.log('done')
    } catch (e) {
        console.log(`An error occurred. Error: ${e}`)
    }
}

executeQuery();
