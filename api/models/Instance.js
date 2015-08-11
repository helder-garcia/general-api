/**
* Instance.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
		connection : 'tsmserverapi',
		autoPk: true,
		autoCreatedAt: false,
		autoUpdatedAt: false,
	  attributes: {
		  instanceName: {
			  type: "string",
			  required: true
		  },
		  IpAddress: {
			  type: "string",
			  required: true
		  },
		  IpPort: {
			  type: "string",
			  required: true
		  },
		  serverName: {
			  type: "string",
			  required: true
		  }
	  }
};

