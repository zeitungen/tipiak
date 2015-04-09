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