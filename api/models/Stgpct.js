/**
 * Stgpct.js
 * 
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	autoPk : true,
	autoCreatedAt : false,
	autoUpdatedAt : false,
	attributes : {
		stgPoolName : {
			type : "string",
			required : true
		},
		pctUtilized : {
			type : "float",
			required : true
		},
		pctMig : {
			type : "float",
			required : true
		}
	}
};
