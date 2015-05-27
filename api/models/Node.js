/**
* Node.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	autoCreatedAt: false,
	autoUpdatedAt: false,
  attributes: {
	  nodeName: {
		  type: "string",
		  required: true,
		  minLength: 6,
		  maxLength: 64
	  },
	  domainName: {
		  type: "string",
		  required: true
	  },
	  archDelete: {
		  type: "boolean",
		  required: false
	  },
	  backDelete: {
		  type: "boolean",
		  required: false
	  },
	  maxNummp: {
		  type: "integer",
		  required: false
	  }
  }
};

