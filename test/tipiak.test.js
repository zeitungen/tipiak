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
			if(err) { return done(err); }
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
			if(err) { return done(err); }
			for(var i in f.fixtures) {
				tipiak.fixtures.should.have.property(f.fixtures[i]);
			}
			done();
		});
	});

	it("Tipiak instance should have a method scutlling", function() {
		tipiak.should.have.property("scutlling");
		tipiak.scutlling.should.be.a.type("function");
	});

	it("Tipiak instance should load all models and fixture with scutlling method", function(done) {
		var m = fixtures.models;
		var f = fixtures.fixtures;
		tipiak.scutlling(m.path, f.path, function(err, models, fixtures) {
			if(err) { return done(err); }
			for(var i in f.models) {
				tipiak.models.should.have.property(f.models[i]);
			}
			for(var i in f.fixtures) {
				tipiak.fixtures.should.have.property(f.fixtures[i]);
			}
			done();
		});
	});

	it("Tipaik instance should have rob method", function() {
		tipiak.should.have.property("rob");
		tipiak.rob.should.be.a.type("function");
	});

	it("Tipiak instance should return an error if don't use an existing model key into loaded fixtures", function(done) {
		tipiak.scutlling(fixtures.models.path, fixtures.fixtures.path, function(err, models, fixtures) {
			if(err) { return done(err); }
			tipiak.rob("aaaaa", "bbbbb", function(err, instance) {
				err.should.be.not.eql(null);
				done();
			})
		});
	});

	it("Tipiak instance should return an error if don't use an existing ressource key into loaded fixtures", function(done) {
		tipiak.scutlling(fixtures.models.path, fixtures.fixtures.path, function(err, models, fixtures) {
			if(err) { return done(err); }
			tipiak.rob("User", "bbbbb", function(err, instance) {
				err.should.be.not.eql(null);
				done();
			})
		});
	});

	it("Tipiak instance should get a fixture from a model with rob method", function(done) {
		tipiak.scutlling(fixtures.models.path, fixtures.fixtures.path, function(err, models, fixtures) {
			if(err) { return done(err); }
			tipiak.rob("User", "jonsnow", function(err, jonsnow) {
				if(err) { return done(err); }
				jonsnow.should.have.property("email", "jon.snow@nightwatch.com");
				jonsnow.should.have.property("password", "ghost");
				jonsnow.should.have.property("firstname", "Jon");
				jonsnow.should.have.property("lastname", "Snow");
				done();
			});
		});
	});
});