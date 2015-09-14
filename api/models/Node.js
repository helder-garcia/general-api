/**
* Node.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoPk: true,
	autoCreatedAt: false,
	autoUpdatedAt: false,
  attributes: {
	  nodeName: {
		  type: "string",
		  required: true,
		  minLength: 6,
		  maxLength: 64,
		  unique: true,
		  primaryKey: true
	  },
	  domainName: {
		  type: "string",
		  required: true
	  },
	  archDelete: {
		  type: "string",
		  required: false
	  },
	  backDelete: {
		  type: "string",
		  required: false
	  },
	  isLocked: {
		  type: "string",
		  required: false
	  },
	  maxNummp: {
		  type: "integer",
		  required: false
	  },
	  platformName: {
		  type: "string",
		  required: true
	  }
  }
};

