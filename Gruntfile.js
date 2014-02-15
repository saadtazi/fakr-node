module.exports = function(grunt) {
  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['examples/**', 'node_modules/**'],
        globals: { 'feature': false,
                  'it': false
                 }
      },
      all: ['**/*.js']
    },

    watch: {
      all: {
        files: ['**/*.js'],
        tasks: ['jshint', 'mochaTest']
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: ['coverage/blanket.js', 'test/globals.js']
        },
        src: ['test/spec/**/*.spec.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          // use the quiet flag to suppress the mocha console output
          quiet: true,
          // specify a destination file to capture the mocha
          // output (the quiet option does not suppress this)
          captureFile: 'coverage/coverage.html',
          require: ['test/globals.js']
        },
        src: ['test/spec/**/*.spec.js']
      }
    }

  });

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('travis', ['jshint', 'test']);
  grunt.registerTask('default', ['jshint', 'test']);

};