# tipiak

Fixture/Mocking loader for waterline orm

## How install ?

    $ npm install tipiak
  
## How use it ?

Easy to load your fixtures and `waterline` models and get an instance from the fixtures defintion:

  ```javascript
  var Tipiak = require("tipiak");
  var tipiak = new Tipiak();
  tipiak.scutlling("/path/to/models", "path/to/fixtures", function(err, models, fixtures) {
    tipiak.rob("User", "jonsnow", function(err, jonsnow) {
      // jonsnow is an instance from Waterline User model
    }
  });
  ```
  
Just expect you have at `/path/to/model` a Waterline User model (`User.js` file):

  ```javascript
  module.exports = {
  	attributes: {
  		email: { type: "string" },
  		password: { type: "string" },
  		firstname: { type: "string" },
  		lastname: { type: "string" },
  
  		getFullName: function() {
  			return this.firstname + " " + this.lastname;
  		}
  	}
  }
  ```
And just expect you have at `/path/to/fixtures` a `user.json` file:

  ```json
  {
  	"jonsnow": {
  		"email": "jon.snow@nightwatch.com",
  		"password": "ghost",
  		"firstname": "Jon",
  		"lastname": "Snow"
  	}
  } 
  ```
