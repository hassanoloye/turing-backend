import _ from "lodash";

export const getAllConfig = () => {
    return {
        method: 'get',
        classMethodName: 'getAll',
        params: [],
    }
};

export const getOneConfig = (params: any = ['id']) => {
    return {
        method: 'get',
        classMethodName: 'get',
        params: _.isEmpty(params) ? ['id'] : params,
    }
};

const routesConfig = {
    // department routes config
    'departments': [
        {
            name: 'Get Departments',
            ...getAllConfig()
        }, {
            name: 'Get Department by ID',
            ...getOneConfig(['department_id'])
        }
    ],
};

export default routesConfig;
