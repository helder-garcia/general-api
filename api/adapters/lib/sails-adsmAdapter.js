/**
 * Module dependencies
 */

var _ = require('lodash');
var Errors = require('waterline-errors').adapter;
var _runJoins = require('waterline-cursor');
var Database = require('./database');
var shell = require('shelljs');

shell.config.silent = true;



/*---------------------------------------------------------------
  :: DiskAdapter
  -> adapter

  This disk adapter is for development only!
---------------------------------------------------------------*/
module.exports = (function () {

	var serverNameConfig = sails.config.connections.developmentTsmServer.servername.trim();
	
  // Hold connections for this adapter
  var connections = {};
  function normalizeCriteria(options) {

	  return _.mapValues(options, function (original, key) {
	    if (key === 'where') return original;	   
	    return "";
	  });
	};

  var adapter = {

    identity: 'sails-adsm',

    // Which type of primary key is used by default
   // pkFormat: 'integer',

    // Whether this adapter is syncable (yes)
    // syncable: true,
    syncable: false,

    // How this adapter should be synced
    migrate: 'safe',

    // Allow a schemaless datastore
    defaults: {
    	type: 'json',
    	schema: false,
    	commandPath: '/opt/tivoli/tsm/client/ba/bin/',
    	commandName: 'dsmadmc',
    	serverName: serverNameConfig
    },

    // Register A Connection
    registerConnection: function (connection, collections, cb) {

      if(!connection.identity) return cb(Errors.IdentityMissing);
      if(connections[connection.identity]) return cb(Errors.IdentityDuplicate);

      connections[connection.identity] = new Database(connection, collections);
      connections[connection.identity].initialize(cb);
    },

    // Teardown a Connection
    teardown: function (conn, cb) {

      if (typeof conn == 'function') {
        cb = conn;
        conn = null;
      }
      if (conn == null) {
        connections = {};
        return cb();
      }
      if(!connections[conn]) return cb();
      delete connections[conn];
      cb();
    },

    // Return attributes
    describe: function (conn, coll, cb) {
      grabConnection(conn).describe(coll, cb);
    },

    define: function (conn, coll, definition, cb) {
      grabConnection(conn).createCollection(coll, definition, cb);
    },

    drop: function (conn, coll, relations, cb) {
      grabConnection(conn).dropCollection(coll, relations, cb);
    },

    find: function (conn, coll, options, cb) {
    	switch (coll) {
	    	case "node": this.findNode(options, cb); break;
	    	case "activity": this.findActivity(options, cb); break;
	    	case "migsummary": this.findMigSummary(options, cb); break;
	    	case "drive": this.findDrive(options, cb); break;
	    	case "stgpct": this.findStgPct(options, cb); break;
    	}
 
    },
    
    findNode: function(options, cb) {
    //	console.log("options: " + JSON.stringify(cb, null, 4));
      var criteria = _.mapValues(options, 'nodeName');
      var whereNode = criteria.where;
      var result =[];
  	  var myRegex = new RegExp(/(\w+),(\w+),(\w+),(\w+),(\w+),(\d\d\d\d-\d\d-\d\d)\s(\d\d\:\d\d\:\d\d)\.\d\d\d\d\d\d,(\w+),(\w*)*.*/);
      var cmd = this.defaults.commandPath + this.defaults.commandName + ' -se=' + this.defaults.serverName + 
      ' -id=web_service -password=web_service -dataonly=yes -displaymode=tab -comma' + 
      ' "select NODE_NAME,' +
      ' DOMAIN_NAME,' +
      ' ARCHDELETE,' +
      ' BACKDELETE,' +
      ' LOCKED,' +
      ' LASTACC_TIME,' +
      ' MAX_MP_ALLOWED,' +
      ' PLATFORM_NAME' +
      ' from nodes';
      if(_.isEmpty(whereNode)) {
    	  cmd = cmd + '"';
      } else {  	  
    	  cmd = cmd + ' where NODE_NAME=\'' + whereNode.toUpperCase() + '\'"';
      }
      var child = shell.exec(cmd, {async: true});
      child.stdout.on('data', function(data) {
    	  arrayOfLines = data.match(/[^\r\n]+/g);
    	  
    	  for (var i = 0, len = arrayOfLines.length; i < len; i++) { 		  
    		  if (arrayOfLines[i].match(/^ANS\d\d\d\d/)) { continue; }
    		  var parsedLine = myRegex.exec(arrayOfLines[i]);
    		  if(parsedLine !== null) {
    		  result.push({
    			  nodeName: parsedLine[1],
    			  domainName: parsedLine[2],
    			  archDelete: parsedLine[3],
    			  backDelete: parsedLine[4],
    			  isLocked: parsedLine[5],
    			  lastAccTime: parsedLine[6] + 'T' + parsedLine[7],
    			  maxNummp: parsedLine[8],
    			  platformName: parsedLine[9],
    			  instanceName: "SERVER1",
    			  instanceIp: "10.200.144.37",
    			  instancePort: "3501"
    		    });
    		  }
    	  }    	  
    	});
      child.stdout.on('end', function() { 
    	  //var response = { "count" : result.length, "data" : result};
    	  //cb.apply(null, Array.prototype.slice.call(response));
    	  cb(null, result); 
    	  });      
    },
    
    findStgPct: function(options, cb) {
        var result =[];
        var myRegex = new RegExp(/(\w+),(\w+\.\d),(\w+\.\d)*.*/);
        var cmd = this.defaults.commandPath + this.defaults.commandName + ' -se=tsmbsbbkp2800' + 
        ' -id=relatorios -password=relatorios -dataonly=yes -displaymode=tab -comma' + 
        ' "select STGPOOL_NAME,' +
        ' PCT_UTILIZED,' +
        ' PCT_MIGR' +
        ' from stgpools' +
        ' where POOLTYPE=\'PRIMARY\'' + 
        ' and (DEVCLASS=\'DISK\' OR DEVCLASS=\'FILE\')"';
        var child = shell.exec(cmd, {async: true});
        child.stdout.on('data', function(data) {
      	  arrayOfLines = data.match(/[^\r\n]+/g);
      	  
      	  for (var i = 0, len = arrayOfLines.length; i < len; i++) { 		  
      		  if (arrayOfLines[i].match(/^ANS\d\d\d\d/)) { continue; }
      		  var parsedLine = myRegex.exec(arrayOfLines[i]);
      		  result.push({
      			  stgPoolName: parsedLine[1],
      			  pctUtilized: parsedLine[2],
      			  pctMig: parsedLine[3]
      		    });	 
      	  }    	  
      	});
        child.stdout.on('end', function() { 
        	cb(null, result); 
      	});      
      },

    findDrive: function(options, cb) {
        var result =[];
    	var myRegex = new RegExp(/(\w+),(\w+),(\w+),(\w+),(\w+),(\w*),(\w+),(\w*)*.*/);
        var cmd = this.defaults.commandPath + this.defaults.commandName + ' -se=tsm1700 ' +  
        ' -id=web_service -password=web_service -dataonly=yes -displaymode=tab -comma' + 
        ' "select LIBRARY_NAME,' +
        ' DRIVE_NAME,' +
        ' DEVICE_TYPE,' +
        ' ONLINE,' +
        ' DRIVE_STATE,' +
        ' ALLOCATED_TO,' +
        ' DRIVE_SERIAL,' +
        ' VOLUME_NAME' +
        ' from DRIVES"';
        var child = shell.exec(cmd, {async: true});
        child.stdout.on('data', function(data) {
      	  arrayOfLines = data.match(/[^\r\n]+/g);
      	  
      	  for (var i = 0, len = arrayOfLines.length; i < len; i++) { 		  
      		  if (arrayOfLines[i].match(/^ANS\d\d\d\d/)) { continue; }
      		  var parsedLine = myRegex.exec(arrayOfLines[i]);
      		  result.push({
      			libraryName: parsedLine[1],
      			driveName: parsedLine[2],
      			deviceType: parsedLine[3],
      			driveOnline: parsedLine[4],
      			driveState: parsedLine[5],
      			allocatedTo: parsedLine[6],
      			driveSerial: parsedLine[7],
      			volumeName: parsedLine[8]
      		  });	 
      	  }    	  
      	});
        child.stdout.on('end', function() { 
      	  //var response = { "count" : result.length, "data" : result};
      	  //cb.apply(null, Array.prototype.slice.call(response));
      	  cb(null, result); 
      	  });      
      },
      
    findMigSummary: function(options, cb) {
        var result =[];
    	var myRegex = new RegExp(/(\w+),(\w+),(\w+),(\w+),(\w+),(\d\d\d\d-\d\d-\d\d)\s(\d\d\:\d\d\:\d\d)\.\d\d\d\d\d\d,(\w+),(\w+)*.*/);
        var cmd = this.defaults.commandPath + this.defaults.commandName + ' -se=' + this.defaults.serverName + 
        ' -id=web_service -password=web_service -dataonly=yes -displaymode=tab -comma' + 
        ' "select NODE_NAME,' +
        ' DOMAIN_NAME,' +
        ' ARCHDELETE,' +
        ' BACKDELETE,' +
        ' LOCKED,' +
        ' LASTACC_TIME,' +
        ' MAX_MP_ALLOWED,' +
        ' PLATFORM_NAME' +
        ' from nodes"';
        var child = shell.exec(cmd, {async: true});
        child.stdout.on('data', function(data) {
      	  arrayOfLines = data.match(/[^\r\n]+/g);
      	  
      	  for (var i = 0, len = arrayOfLines.length; i < len; i++) { 		  
      		  if (arrayOfLines[i].match(/^ANS\d\d\d\d/)) { continue; }
      		  var parsedLine = myRegex.exec(arrayOfLines[i]);
      		  result.push({
      			  nodeName: parsedLine[1],
      			  domainName: parsedLine[2],
      			  archDelete: parsedLine[3],
      			  backDelete: parsedLine[4],
      			  isLocked: parsedLine[5],
      			  lastAccTime: parsedLine[6] + 'T' + parsedLine[7],
      			  maxNummp: parsedLine[8],
      			  platformName: parsedLine[9]
      		    });	 
      	  }    	  
      	});
        child.stdout.on('end', function() { 
      	  //var response = { "count" : result.length, "data" : result};
      	  //cb.apply(null, Array.prototype.slice.call(response));
      	  cb(null, result); 
      	  });      
      },

      findActivity: function(options, cb) {
          var result =[];
      	var myRegex = new RegExp(/(\w+),(\w+),(\w+),(\w+),(\w+),(\d\d\d\d-\d\d-\d\d)\s(\d\d\:\d\d\:\d\d)\.\d\d\d\d\d\d,(\w+),(\w+)*.*/);
          var cmd = this.defaults.commandPath + this.defaults.commandName + ' -se=' + this.defaults.serverName + 
          ' -id=web_service -password=web_service -dataonly=yes -displaymode=tab -comma' + 
          ' "select NODE_NAME,' +
          ' DOMAIN_NAME,' +
          ' ARCHDELETE,' +
          ' BACKDELETE,' +
          ' LOCKED,' +
          ' LASTACC_TIME,' +
          ' MAX_MP_ALLOWED,' +
          ' PLATFORM_NAME' +
          ' from nodes"';
          var child = shell.exec(cmd, {async: true});
          child.stdout.on('data', function(data) {
        	  arrayOfLines = data.match(/[^\r\n]+/g);
        	  
        	  for (var i = 0, len = arrayOfLines.length; i < len; i++) { 		  
        		  if (arrayOfLines[i].match(/^ANS\d\d\d\d/)) { continue; }
        		  var parsedLine = myRegex.exec(arrayOfLines[i]);
        		  result.push({
        			  nodeName: parsedLine[1],
        			  domainName: parsedLine[2],
        			  archDelete: parsedLine[3],
        			  backDelete: parsedLine[4],
        			  isLocked: parsedLine[5],
        			  lastAccTime: parsedLine[6] + 'T' + parsedLine[7],
        			  maxNummp: parsedLine[8],
        			  platformName: parsedLine[9]
        		    });	 
        	  }    	  
        	});
          child.stdout.on('end', function() { 
        	  //var response = { "count" : result.length, "data" : result};
        	  //cb.apply(null, Array.prototype.slice.call(response));
        	  cb(null, result); 
        	  });      
        },
        
    join: function (conn, coll, criteria, _cb) {

      // Ensure nextTick
      var cb = AFTERDELAY(_cb);

      var db = grabConnection(conn);

      var parentIdentity = coll;

      // Populate associated records for each parent result
      // (or do them all at once as an optimization, if possible)
      _runJoins({

        instructions: criteria,
        parentCollection: parentIdentity,

        /**
		 * Find some records directly (using only this adapter) from the
		 * specified collection.
		 * 
		 * @param {String}
		 *            collectionIdentity
		 * @param {Object}
		 *            criteria
		 * @param {Function}
		 *            cb
		 */
        $find: function (collectionIdentity, criteria, cb) {
          return db.select(collectionIdentity, criteria, cb);
        },

        /**
		 * Look up the name of the primary key field for the collection with the
		 * specified identity.
		 * 
		 * @param {String}
		 *            collectionIdentity
		 * @return {String}
		 */
        $getPK: function (collectionIdentity) {
          if (!collectionIdentity) return;
          return db.getPKField(collectionIdentity);
        }
      }, cb);

    },

    create: function (conn, coll, values, cb) {
    	var self = this;
    	var originalValues = _.clone(values);

    	if(!Array.isArray(values)) values = [values];
		  for (var i in values) {
			    var record = values[i];
			    Object.keys(record).forEach(function(key) {
			    	if(typeof(record[key]) === 'string')
			    		record[key] = record[key].replace(/(\")/g,"");
			    });
			    record['archDelete'] = typeof(record['archDelete']) == "undefined" ? "yes" : record['archDelete'];
			    record['backDelete'] = typeof(record['backDelete']) == "undefined" ? "no" : record['backDelete'];
			    record['maxNummp'] = typeof(record['maxNummp']) == "undefined" ? 4 : record['maxNummp'];
			    /**** That's the create part of the code. Consider making it a service ****/
			      var cmd = this.defaults.commandPath + this.defaults.commandName + ' -se=' + this.defaults.serverName + 
			      		' -id=web_service -password=web_service -dataonly=yes ' + 
			      		'"reg node ' +
			      		record['nodeName'] + ' ' +
			      		record['nodeName'] + ' ' +
			      		'domain=' +
			      		record['domainName'] + ' ' +
			      		'maxnummp=' +
			      		record['maxNummp'] + ' ' +
			      		'backdel=' +
			      		record['backDelete'] + ' ' +
			      		'archdel=' +
			      		record['archDelete'] +		      		
			      		'"';
			      
			      var child = shell.exec(cmd, {async: false});
			      /*
			       * 0  - Success
			       * 10 - Node name already exists
			       * 11 - Domain name does not exist
			       * 
			       */
			      if (child.code == 10) return cb(new Error('Node name already exists'));
			      if (child.code == 11) return cb(new Error("Domain name does not exist"));
			      if (child.code == 0) {
			    	  record['instanceName'] ="SERVER1";
		    		  record['instanceIp'] ="10.200.144.37";
		    		  record['instancePort'] = "3501";
		    		  cb(null, record);
			      }
			      //if (child.code == 0) cb(null, Array.isArray(originalValues) ? values : values[0]);
			      /*
			      child.stdout.on('data', function(data) {
			    	  console.log(data);
			    	});
			      child.stdout.on('end', function() { 
			    	  console.log(child.code);
			    	  	cb(null, Array.isArray(originalValues) ? values : values[0]); 
			    	  });

			    */

			   // self.data[conn].push(record);
		  };
		  
		  //cb(null, Array.isArray(originalValues) ? values : values[0]);
		  /*
    	var $nodeName = values.nodeName;
    	$nodeName = $nodeName.replace(/(\")/g,"");
    	var $domainName = values.domainName;
    	$domainName = $domainName.replace(/(\")/g,"");
    	var $archDelete = values.archDelete;
    	$archDelete = $archDelete.replace(/(\")/g,"");
    	var $backDelete = values.backDelete;
    	$backDelete = $backDelete.replace(/(\")/g,"");
    	var $maxNummp = values.maxNummp;
    	$maxNummp = $maxNummp.replace(/(\")/g,"");
    	*/

    	/*
        var cmd = this.defaults.commandPath + this.defaults.commandName + ' -se=' + this.defaults.serverName + ' -id=web_service -password=web_service -dataonly=yes "q node"';
        var child = shell.exec(cmd, {async: true});
        child.stdout.on('data', function(data) {

      	  arrayOfLines = data.match(/[^\r\n]+/g);
      	  
      	  for (var i = 0, len = arrayOfLines.length; i < len; i++) {
      		  
      		  if (arrayOfLines[i].match(/^ANS\d\d\d\d/)) { continue; }

      		 // console.log(nodeRegex.exec(arrayOfLines[i])[1]);
      		  result.push({
      			  nodeName: nodeRegex.exec(arrayOfLines[i])[1],
      			  domainName: domainRegex.exec(arrayOfLines[i])[1]
      		    });	 
      	  }
      	  
      	});
        child.stdout.on('end', function() { cb(null, result); });
		*/
    	//console.log("conn: " + conn + "\n");
    	//console.log("coll: " + coll + "\n");
    	//console.log("values: " + JSON.stringify(values, null, 4) + "\n");
    	//console.log("nodeName: " + $nodeName);
    	//console.log("domainName: " + $domainName);
    },

    update: function (conn, coll, options, values, cb) {
      grabConnection(conn).update(coll, options, values, AFTERDELAY(cb));
    },

    destroy: function (conn, coll, options, cb) {
      grabConnection(conn).destroy(coll, options, AFTERDELAY(cb));
    }

  };

  adapter.createEach = adapter.create;

  /**
	 * Grab the connection object for a connection name
	 * 
	 * @param {String}
	 *            connectionName
	 * @return {Object}
	 * @api private
	 */

  function grabConnection(connectionName) {
    return connections[connectionName];
  }
  
  return adapter;
})();



/**
 * Return a function that stalls for one milisecond before calling `cb` with the
 * expected arguments and context.
 * 
 * @param {Function}
 *            cb
 * @return {Function}
 */
function AFTERDELAY(cb) {
  return function ( /* ... */ ) {
    var origCtx = this;
    var origArgs = Array.prototype.slice.call(arguments);
    setTimeout(function () {
      cb.apply(origCtx, origArgs);
		    }, 1);
	};
}
