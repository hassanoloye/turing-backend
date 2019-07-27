import {request} from '../config'
import {insertRecord} from "../factory";
import faker from "faker";
import {expect} from "chai";

describe('Test for Attribute routes', () => {
    it('should fetch all attributes', (done) => {
        const attribute: any = {
            name: faker.random.word(),
        };
        insertRecord('attribute', attribute).then((createdAttribute) => {
            request
                .get('/api/v1/attributes/')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.length).to.be.at.least(1);
                    const fetchedAttribute = res.body.find(
                        (attribute: any) => attribute.attribute_id === createdAttribute.attribute_id);
                    expect(fetchedAttribute.attribute_id).equal(createdAttribute.attribute_id);
                    expect(fetchedAttribute.name).equal(createdAttribute.name);
                    done(err);
                });
        });
    });

    it('should fetch attribute details', (done) => {
        const attribute = {
            name: faker.random.word(),
        };
        insertRecord('attribute', attribute).then((createdAttribute) => {
            request
                .get(`/api/v1/attributes/${createdAttribute.attribute_id}/`)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.name).to.equal(createdAttribute.name);
                    done(err);
                });
        });
    });

    it('should fetch attribute values', (done) => {
        const attribute: any = {
            name: faker.random.word(),
        };
        const attributeValue: any = {
            value: faker.random.word(),
        };
        insertRecord('attribute', attribute).then((createdAttribute) => {
            attributeValue.attribute_id = createdAttribute.attribute_id;
            insertRecord('attribute_value', attributeValue).then((createdAttributeValue) => {
                request
                    .get(`/api/v1/attributes/values/${createdAttributeValue.attribute_id}/`)
                    .expect(200)
                    .end(function (err, res) {
                        const fetchedAttributeValue = res.body.find(
                            (attributeValue: any) => attributeValue.attribute_value_id === createdAttributeValue.attribute_value_id);
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0].attribute_value_id).to.equal(createdAttributeValue.attribute_value_id);
                        expect(res.body[0].value).to.equal(createdAttributeValue.value);
                        done(err);
                    });
            });
        });
    });

    it('should fetch product attributes', (done) => {
        const attribute: any = {
            name: faker.random.word(),
        };
        const attributeValue: any = {
            value: faker.random.word(),
        };
        const department: any = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        const category: any = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        const product: any = {
            name: faker.random.word(),
            description: faker.random.words(3),
            price: faker.finance.amount(1, 200)
        };

        insertRecord('attribute', attribute).then((createdAttribute) => {
            attributeValue.attribute_id = createdAttribute.attribute_id;
            insertRecord('attribute_value', attributeValue).then((createdAttributeValue) => {
                insertRecord('department', department).then((createdDepartment) => {
                    category.department_id = createdDepartment.department_id;
                    insertRecord('category', category).then((createdCategory) => {
                        product.category_id = createdCategory.category_id;
                        insertRecord('product', product).then((createdProduct) => {
                            insertRecord('product_attribute', {
                                product_id: createdProduct.product_id,
                                attribute_value_id: createdAttributeValue.attribute_value_id
                            }).then(() => {
                                request
                                    .get(`/api/v1/attributes/inProduct/${createdProduct.product_id}/`)
                                    .expect(200)
                                    .end(function (err, res) {
                                        expect(res.body.length).to.equal(1);

                                        const fetchedProductAttributeValue = res.body[0];

                                        expect(fetchedProductAttributeValue.attribute_name).to.equal(attribute.name);
                                        expect(fetchedProductAttributeValue.attribute_value_id).to.equal(createdAttributeValue.attribute_value_id);
                                        expect(fetchedProductAttributeValue.attribute_value).to.equal(createdAttributeValue.value);
                                        done(err);
                                    });
                            });
                        });
                    });
                });
            });
        });
    });
});
