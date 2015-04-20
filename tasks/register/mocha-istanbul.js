/**
 *
 * tasks/register/mocha-istanbul.js
 *
 */
module.exports = function (grunt) {
	grunt.registerTask('test', ['mocha_istanbul:coverage']);
};
