/**
* Activity.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
		autoPk: true,
		autoCreatedAt: false,
		autoUpdatedAt: false,
	  attributes: {
		  activity: {
			  type: "string",
			  required: true,
		  },
		  address: {
			  type: "string",
			  required: false
		  },
		  affected: {
			  type: "integer",
			  required: false
		  },
		  bytes: {
			  type: "integer",
			  required: false
		  },
		  commMeth: {
			  type: "string",
			  required: false
		  },
		  commWait: {
			  type: "integer",
			  required: false
		  },
		  driveName: {
			  type: "string",
			  required: false
		  },
		  endTime: {
			  type: "datetime",
			  required: false
		  },
		  entity: {
			  type: "string",
			  required: false
		  },
		  examined: {
			  type: "integer",
			  required: false
		  },
		  failed: {
			  type: "integer",
			  required: false
		  },
		  idle: {
			  type: "integer",
			  required: false
		  },
		  lastUse: {
			  type: "string",
			  required: false
		  },
		  libraryName: {
			  type: "string",
			  required: false
		  },
		  mediaW: {
			  type: "integer",
			  required: false
		  },
		  number: {
			  type: "integer",
			  required: false
		  },
		  numOffsiteVols: {
			  type: "integer",
			  required: false
		  },
		  numProcesses: {
			  type: "integer",
			  required: false
		  },
		  scheduleName: {
			  type: "string",
			  required: false
		  },
		  startTime: {
			  type: "datetime",
			  required: false
		  },
		  successful: {
			  type: "string",
			  required: false
		  },
		  volumeName: {
			  type: "string",
			  required: false
		  }
	  }
};

