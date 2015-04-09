var Waterline = require("waterline");
var sailsmemory = require("sails-memory");
var buildDictionary = require("sails-build-dictionary");
var _ = require("lodash");

var CONNECTION_NAME = "memory";
var waterlineConf = {
	adapters: {
		"default": sailsmemory,
		memory: sailsmemory
	},
	connections: { }
}
waterlineConf.connections[CONNECTION_NAME] = {
	adapter: "memory"
}

var Tipiak = function() {
	this.models = null;
	this.fixtures = null;
	this.waterline = null;
}

Tipiak.prototype.loadModels = function(path, cb) {
	var tipiak = this;
	loadModels(path, function(err, models) {
		if(err) { return cb(err) }
		_.each(models, function(model, identity) {
			models[identity] = normalizeModel(model, identity);
		});
		buildOrm(models, function(err, waterline, models) {
			if(err) { return cb(err); }
			tipiak.models = models;
			tipiak.waterline = waterline;
			cb(null, tipiak.models);
		});
	})
}

Tipiak.prototype.loadFixtures = function(path, cb) {
	var tipiak = this;
	buildDictionary.optional({
		dirname: path,
		filter: /^([^.]+)\.(json)$/,
		replaceExpr: /^.*\//,
        flattenDirectories: true,
        identity: false
	}, function(err, fixtures) {
		if(err) { return cb(err); }
		tipiak.fixtures = fixtures;
		cb(null, tipiak.fixtures);
	})
}

// code from sails/lib/hooks/moduleloader/index.js loadModels function
function loadModels(path, cb) {
	// Get the main model files
	buildDictionary.optional({
		dirname: path,
		filter: /^([^.]+)\.(js|coffee|litcoffee)$/,
		replaceExpr: /^.*\//,
        flattenDirectories: true
	}, function(err, models) {
		if(err) { return cb(err); }
		// Get any supplumental files
		buildDictionary.optional({
			dirname: path,
         	filter: /(.+)\.attributes.json$/,
         	replaceExpr: /^.*\//,
         	flattenDirectories: true
		}, function(err, supplements) {
			// bindToSails function from sails/lib/hooks/moduleloader/index.js
			if(err) { return cb(err) }
			_.each(supplements, function(module) {
				// Bind all methods to the module context
				_.bindAll(module);
			});
			return cb(null, _.merge(models, supplements)) 
		});
	});
}

// code from sails/lib/hook/orm/normalize-model.js
function normalizeModel(modelDef, modelID) {
	var newModelDef = {
		identity: modelID,
		tableName: modelID
	}
	newModelDef = _.merge(newModelDef, modelDef);

	_.each(modelDef, function(val, key) {
		if(_.isArray(val)) {
			newModelDef[key] = val;
		}
	});

	// override anyway the connection settings
	newModelDef.connection = [CONNECTION_NAME];
	return newModelDef;
}

// code from sails/lib/hook/orm/build-orm.js
function buildOrm(modelDefs, cb) {
	var waterline = new Waterline();
	_.each(modelDefs, function(modelDef, modelID) {
		waterline.loadCollection(Waterline.Collection.extend(modelDef));
	});
	waterline.initialize(waterlineConf, function(err, orm) {
		if(err) { return cb(err); }
		var models = orm.collections || [];
		_.each(models, function(thisModel, modelID) {
			_.bindAll(thisModel);
			thisModel.associations = _.reduce(thisModel.attributes, function(associatedWith, attrDef, attrName) {
				if(typeof attrDef === "object" && (attrDef.model || attrDef.collection)) {
					var assoc = {
						alias: attrName,
						type: attrDef.model ? "model" : "collection"
					};
					if(attrDef.model) { assoc.model = attrDef.model; }
					if(attrDef.collection) { assoc.collection = attrDef.collection; }
					if(attrDef.via) { assoc.via = attrDef.via }
					associatedWith.push(assoc);
				}
				return associatedWith;
			}, []);
		});
		cb(null, orm, models);
	});
}

module.exports = Tipiak;