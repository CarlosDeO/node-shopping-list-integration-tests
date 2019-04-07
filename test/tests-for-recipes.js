const chai = require("chai");
const chaiHttp = require("chai-http");

const {
    app,
    runServer,
    closeServer
} = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe('recipes', function () {
    before(function () {
        return runServer;
    });

    after(function () {
        return closeServer;
    });

    it('it should list items on GET', function () {
        return chai.request(app)
            .get("/recipes")
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                //question... line below
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ['id', 'name', 'ingredients'];
                res.body.forEach(function (item) {
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it("should add an item on POST", function () {
        const newRecipe = {
            name: 'coffee',
            ingredients: ['ground coffee', 'hot water']
        };
        return chai.request(app)
            .post("/recipes")
            .send(newRecipe)
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys('id', 'name', 'ingredients');
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(
                    Object.assign(newRecipe, {
                        id: res.body.id
                    })
                );
            });
    });

    it("should update an item on PUT", function () {
        const updateData = {
            name: 'cereal',
            ingredients: ['milk', 'cereal']
        };
        return chai.request(app)
            // why not put method?
            .get("/recipes")
            .then(function (res) {
                updateData.id = res.body[0].id;

                return chai.request(app)
                    .put(`/recipes/${updateData.id}`)
                    .send(updateData)
            })
            .then(function (res) {
                expect(res).to.have.status(204);
            })
    });

    it("should delete items on DELETE", function () {
        return (
            chai.request(app)
            
            .get("/recipes")
            .then(function (res) {
                return chai.request(app).delete(`/recipes/${res.body[0].id}`);
            })
            .then(function (res) {
                expect(res).to.have.status(204);
            })
        );
    });


});