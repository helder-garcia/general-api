/**
 * tasks/config/mocha-istanbul.js
 *
*/
module.exports = function(grunt) {
	grunt.config.set('mocha_istanbul', {
		coverage: {
			src: 'test',
			options: {
				coverageFolder: 'coverage',
				mask: '**/*.spec.js',
				root: 'api/'
			}
		}
	});
	grunt.loadNpmTasks('grunt-mocha-istanbul');
};
