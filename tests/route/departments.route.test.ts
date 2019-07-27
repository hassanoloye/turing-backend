import {request} from '../config'
import {insertRecord} from "../factory";
import faker from "faker";
import {expect} from "chai";

describe('Test for Department routes', () => {
    it('should fetch all departments', (done) => {
        const department: any = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        insertRecord('department', department).then((createdDepartment) => {
            request
                .get('/api/v1/departments/')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.length).to.be.at.least(1);
                    const fetchedDepartment = res.body.find(
                        (department: any) => department.department_id === createdDepartment.department_id);
                    expect(fetchedDepartment.department_id).equal(createdDepartment.department_id)
                    expect(fetchedDepartment.name).equal(department.name);
                    expect(fetchedDepartment.description).equal(department.description);
                    done(err);
                });
        });
    });

    it('should fetch departments details', (done) => {
        const department = {
            name: faker.random.word(),
            description: faker.random.words(3)
        };
        insertRecord('department', department).then((createdDepartment) => {
            request
                .get(`/api/v1/departments/${createdDepartment.department_id}/`)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.description).to.equal(department.description);
                    expect(res.body.name).to.equal(department.name);
                    done(err);
                });
        });
    })
});
