import {IProcedureNames} from "../shared/interface/procedureNames";
import sequelize from './../setup/sequelize.setup'
import _ from 'lodash';
import {baseDir} from '../config'
import * as path from "path";
import {ICustomQueryOption, queryActionTypes} from "../shared/interface/custom-query-option";

const proceduresConfigPath = path.join(baseDir, 'src/config/procedures.json');
const fs = require('fs');
const proceduresConfig = JSON.parse(fs.readFileSync(proceduresConfigPath, 'utf8'));
export default class CRUDMixin {

    private procedureNames: IProcedureNames;

    constructor(args: any) {
        this.procedureNames = args.procedureNames;
    }

    private static _getFirstRecord(data: any[]) {
        return data ? data[0] : null;
    }

    public async getAll(lookupKwargs: any = {}) {
        return await this.queryProcedure(this.procedureNames.getAll, lookupKwargs)
    }

    public async get(lookupKwargs: any = {}) {
        return await this.queryProcedure(this.procedureNames.get, lookupKwargs,
            {action: queryActionTypes.FETCH, firstOnly: true});
    }

    public async update(lookupKwargs: any = {}, values: any) {
        return await this.queryProcedure(this.procedureNames.update, {...lookupKwargs, ...values})
    }

    public async delete(lookupKwargs: any = {}) {
        return await this.queryProcedure(this.procedureNames.delete, lookupKwargs)
    }

    public async create(values: any) {
        return await this.queryProcedure(this.procedureNames.create, values)
    }

    private static _prepareQueryString(procedureName: string, procedureKwargs: any) {
        if (!procedureKwargs) {
            procedureKwargs = {};
        }
        let procedureArgsCallString = '()';
        if (!_.isEmpty(procedureKwargs)) {
            const procedureConfig = proceduresConfig[procedureName];
            const procedureParameters = procedureConfig && procedureConfig.parameters;
            const procedureArgs = procedureParameters && procedureParameters.length ?
                procedureParameters.map((parameter: string) => procedureKwargs[parameter] != null ? `"${procedureKwargs[parameter]}"` : '""') : Object.values(procedureKwargs);
            procedureArgsCallString = `(${procedureArgs.join(",")})`;
        }

        return `${procedureName}${procedureArgsCallString}`;
    }

    public async queryProcedure(procedureName: string = '', procedureKwargs: any = {}, option: ICustomQueryOption = {}) {
        if (!procedureName) {
            throw new Error('Procedure name required')
        }
        if (!_.keys(proceduresConfig).includes(procedureName)) {
            throw new Error('Procedure name not found in config');
        }
        const queryString = CRUDMixin._prepareQueryString(procedureName, procedureKwargs);
        const data = await sequelize.query(`CALL ${queryString}`);
        return (option.firstOnly && option.action === queryActionTypes.FETCH
            || option.action === queryActionTypes.CREATE) ? CRUDMixin._getFirstRecord(data) : data;
    }

}
