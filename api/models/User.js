/**
 * User.js
 * 
 * @description :: User model for the API administration using frontend
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
		connection : 'localDiskDb',
		autoPk: true,
		autoCreatedAt: false,
		autoUpdatedAt: false,
		attributes: {
			username: {
				type: "string",
				required: true,
				minLength: 6,
				maxLength: 24,
				unique: true
			},
			encryptedPassword: {
				type: "string"
			},
			email: {
				type: 'email',
				unique: true
			},
			role: {
				type: "string",
				enum: ['admin', 'user']
			},
			toJSON: function() {
				var obj = this.toObject();
				delete obj.password;
				delete obj.confirmation;
				delete obj._csrf;
				return obj;
			}
		},
		beforeCreate: function (values, next) {
			// Makes sure the password and password confirmation match
			if (!values.password || values.password != values.confirmation) {
				return next({err: ['Password does not match password confirmation.']});
			}

			// Encrypts the password/confirmation to be stored in the db
			require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
				values.encryptedPassword = encryptedPassword;

				next();
			});
		}
};

