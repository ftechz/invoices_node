/**
* Task to pull out specific files from bower packages.
* If we don't do this, Sails will copy ALL the bower package files to the .tmp directory
*/
module.exports = function (grunt) {
    grunt.config.set('bower', {
        install: {
            options: {
                targetDir: './assets/js/dependencies',
                install: true,
                cleanTargetDir: false,
                cleanBowerDir: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
};
