import {request} from '../config'
import {insertRecord} from "../factory";
import faker from "faker";
import {expect} from "chai";
import {hashPassword} from "../../src/shared/utils/account.utils";

describe('Test for Customer routes', () => {
    it('should login a customer', (done) => {
        const customer: any = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
        const customerInsert = {
            ...customer,
            password: hashPassword(customer.password)
        };
        insertRecord('customer', customerInsert).then((createdCustomer) => {
            request
                .post('/api/v1/customers/login/')
                .send({email: customer.email, password: customer.password})
                .expect(200)
                .end(function (err, res) {
                    console.log(res.body)
                    expect(Boolean(res.body.accessToken)).to.equal(true);
                    expect(Boolean(res.body.customer.schema)).to.equal(true);
                    expect(Boolean(res.body.expiresIn)).to.equal(true);
                    done(err);
                });
        });
    });

    it('should create a customer', (done) => {
        const customer: any = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
        request
            .post(`/api/v1/customers/`)
            .send(customer)
            .expect(201)
            .end(function (err, res) {
                expect(Boolean(res.body.accessToken)).to.equal(true);
                expect(Boolean(res.body.customer.schema)).to.equal(true);
                expect(Boolean(res.body.expiresIn)).to.equal(true);
                done(err);
            });
    });
});
