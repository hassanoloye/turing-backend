import passport from "passport";
import {Strategy} from "passport-local";
import CRUDMixin from "../mixin/crud.mixin";
import {comparePassword} from "../shared/utils/account.utils";
import {queryActionTypes} from "../shared/interface/custom-query-option";


const crudMixin = new CRUDMixin({});

passport.use(new Strategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (username: string, password: string, done: any) => {
        const customer: any = await crudMixin.queryProcedure('customer_get_login_info',
            {email: username}, { action: queryActionTypes.FETCH, firstOnly: true});
        if (!customer) {
            return done(new Error('User not found'), null)
        } else {
            if (!comparePassword(customer.password, password)) {
                return done(new Error('Incorrect username or password'), null)
            } else {
                const customerDetails: any = await crudMixin.queryProcedure('customer_get_customer',
                    {customer_id: customer.customer_id}, { action: queryActionTypes.FETCH, firstOnly: true});
                delete customerDetails.password;
                return done(null, customerDetails);
            }
        }
    }
));

export default passport
