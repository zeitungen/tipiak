var path = require("path");
var Tipiak = require("../lib/tipiak.js");

var fixtures = {
	models: { 
		path: path.join(process.cwd(), "test", "fixtures", "models"),
		models: ["user"]
	},
	fixtures: {
		path: path.join(process.cwd(), "test", "fixtures", "fixtures"),
		fixtures: ["user"]
	}
};

describe("Tipiak", function() {
	var tipiak = null;

	beforeEach(function() {
		tipiak = new Tipiak();
	});

	afterEach(function() {
		tipiak = null;
	});

	it("Tipiak instance should have models attribute", function() {
		tipiak.should.have.property("models");
	});

	it("Tipiak instance should have fixtures attribute", function() {
		tipiak.should.have.property("fixtures");
	});

	it("Tipiak instance should have a method loadModels", function() {
		tipiak.should.have.property("loadModels");
		tipiak.loadModels.should.be.a.type("function");
	});

	it("Tipak instance should load all models into models attribute", function(done) {
		var f = fixtures.models;
		tipiak.loadModels(f.path, function(err, models) {
			for(var i in f.models) {
				tipiak.models.should.have.property(f.models[i]);
			}
			done();
		});
	});

	it("Tipiak instance should have a method loadFixtures", function() {
		tipiak.should.have.property("loadFixtures");
		tipiak.loadFixtures.should.be.a.type("function");
	});

	it("Tipiak instance should load all fixtures into fixtures attribute (only json fixtures)", function(done) {
		var f = fixtures.fixtures;
		tipiak.loadFixtures(f.path, function(err, fixtures) {
			for(var i in f.fixtures) {
				tipiak.fixtures.should.have.property(f.fixtures[i]);
			}
			done();
		});
	});

});