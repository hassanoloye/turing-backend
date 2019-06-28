export const queryActionTypes = {
    FETCH: 'fetch',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
};

export interface ICustomQueryOption {
    action?: string,
    firstOnly?: boolean,
    modelName?: string,
    modelLookUpField?: string,
    modelShortLookUpField?: string,
}
