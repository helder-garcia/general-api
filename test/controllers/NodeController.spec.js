var assert = require('chai').assert;
var expect = require('chai').expect;
//var StubHelper = require('../../fixtures/StubHelper.js');
var request = require('supertest');
//var NodeController = require('../../api/controllers/NodeController'),
//	sinon = require('sinon'),
//	assert = require('assert'),
//	request = require('request'),
//	should = require('should');
//var expect = require("chai").expect;
//it('should return 400', function (done) {
	 
//	  request.get('http://localhost:1337', function (err, res, body){
//		  setTimeout(function() {
		  //console.log("retorno " + res.statusCode);
		  //if(err) return done(err);
//		  expect(true).to.be.false;
		  
	    //expect(res.statusCode).to.equal(400);
	    //expect(res.body).to.equal('wrong header');
//	    done();
//		 }, 1000);
//	  });

//	});

//describe("HTTP Requests tests", function() {
 //   it("Home page should respond to HTTP request with 200", function(done) {
//    	request.get('http://localhost:1337', function (err, res, body){
//    		if(err) return done(err);
//    		expect(res.statusCode).to.equal(400);
//    		done();
//    	});
//    });
//});

describe('HTTP Requests tests', function() {
	it('home page should return 200', function (done) {
	request(sails.hooks.http.app)
	.get('')
	.send({ email: "a@a.com", password: "wrong" })
	.expect(401,done);
	});
	});
