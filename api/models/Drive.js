/**
* Drives.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
		autoPk: true,
		autoCreatedAt: false,
		autoUpdatedAt: false,
	  attributes: {
		  libraryName: {
			  type: "string",
			  required: true,
		  },
		  driveName: {
			  type: "string",
			  required: false
		  },
		  deviceType: {
			  type: "string",
			  required: false
		  },
		  driveOnline: {
			  type: "string",
			  required: false
		  },
		  driveState: {
			  type: "string",
			  required: false
		  },
		  allocatedTo: {
			  type: "string",
			  required: false
		  },
		  driveSerial: {
			  type: "string",
			  required: false
		  },
		  volumeName: {
			  type: "string",
			  required: false
		  }
	  }
};

