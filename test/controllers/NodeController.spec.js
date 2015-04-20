var NodeController = require('../../api/controllers/NodeController'),
	sinon = require('sinon'),
	assert = require('assert');
describe('The Node Controller', function() {
	describe('When we invoke the index action', function() {
		it('should return hello world message', function() {
			var send = sinon.spy();
			NodeController.index(null, {
				'send': send
			});
			assert(send.called);
			assert(send.calledWith('Hello World'));
		});
	});
});
