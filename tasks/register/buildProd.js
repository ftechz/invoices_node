module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
		'bower:install',
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};
