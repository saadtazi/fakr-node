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
      options: {
        reporter: 'spec',
        require: 'test/globals.js'
      },
      all: {
        src: ['test/spec/**/*.spec.js']
      }
    }

  });

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['jshint', 'test']);
};