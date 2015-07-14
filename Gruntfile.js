module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    clean: ['dist'],

    uglify: {
      min: {
        files: {
          'dist/jquery-http.min.js': ['src/main.js']
        }
      }
    }
  });

  grunt.registerTask('copy-src', function() {
    grunt.file.copy('src/main.js', 'dist/jquery-http.js');
  });

  grunt.registerTask('build', ['clean', 'uglify:min', 'copy-src']);
};
