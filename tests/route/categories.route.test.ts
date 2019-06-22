import {request} from '../config'
import {insertRecord} from "../factory";
import assert from "assert";
import faker from "faker";

describe('Test for Categories routes', () => {
    it('should fetch all categories', (done) => {
        request
            .get('/api/v1/categories/')
            .expect(200)
            .end(function (err, res) {
                if (err) throw err;
                done(err);
            });
    });

    it('should fetch category details', (done) => {
        const department: any = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        const category: any = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        insertRecord('department', department).then((createdDepartment) => {
            category.department_id = createdDepartment.department_id;
            insertRecord('category', category).then((createdCategory) => {
                request
                    .get(`/api/v1/categories/${createdCategory.category_id}/`)
                    .expect(200)
                    .end(function (err, res) {
                        assert.strictEqual(res.body.description, category.description);
                        assert.strictEqual(res.body.name, category.name);
                        done(err);
                    });
            });
        });
    });

    it("should fetch categories for product", (done) => {
        const product: any = {
            name: faker.random.word(),
            description: faker.random.words(3),
            price: faker.finance.amount(1, 200)
        };
        const department: any = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        const category: any = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        insertRecord('department', department).then((createdDepartment) => {
            category.department_id = createdDepartment.department_id;
            insertRecord('category', category).then((createdCategory) => {
                product.category_id = createdCategory.category_id;
                insertRecord('product', product).then((createdProduct) => {
                    request
                        .get(`/api/v1/categories/inProduct/${createdProduct.product_id}/`)
                        .expect(200)
                        .end(function (err, res) {
                            assert.strictEqual(res.body.length, 1);
                            assert.strictEqual(res.body[0].category_id, createdCategory.category_id);
                            assert.strictEqual(res.body[0].name, createdCategory.name);
                            assert.strictEqual(res.body[0].department_id, createdDepartment.department_id);
                            done(err);
                        });
                });
            })
        });
    });

    it("should fetch categories for departments", (done) => {
        const department: any = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        const category: any = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        insertRecord('department', department).then((createdDepartment) => {
            category.department_id = createdDepartment.department_id;
            insertRecord('category', category).then((createdCategory) => {
                request
                    .get(`/api/v1/categories/inDepartment/${createdDepartment.department_id}/`)
                    .expect(200)
                    .end(function (err, res) {
                        assert.strictEqual(res.body.length, 1);
                        assert.strictEqual(res.body[0].category_id, createdCategory.category_id);
                        assert.strictEqual(res.body[0].name, createdCategory.name);
                        assert.strictEqual(res.body[0].description, createdCategory.description);
                        done(err);
                    });
            });
        });
    });
});
