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
        ignores: ['lib-cov/**', 'examples/**', 'node_modules/**'],
        globals: { 'feature': false,
                  'it': false
                 }
      },
      all: ['**/*.js']
    },

    clean: {
      coverage: {
        src: ['lib-cov/*', 'lib-cov/!.gitkeep', 'coverage/*.html']
      }
    },
    copy: {
      test: {
        expand: true,
        filter: 'isFile',
        src: ['test/**'],
        dest: 'lib-cov/'
      }
    },
    blanket: {
      spec: {
        src: ['lib/'],
        dest: 'lib-cov/lib/'
      }
    },

    mochaTest: {
      testForCoverage: {
        options: {
          reporter: 'spec',
          require: ['lib-cov/test/globals.js']
        },
        src: ['lib-cov/test/spec/**/*.spec.js']
      },
      'mocha-lcov-reporter': {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: './lib-cov/lcov.info'
        },
        src: ['lib-cov/test/spec/**/*.spec.js']
      },
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['lib-cov/test/spec/**/*.spec.js']
      },

      testLocal: {
        options: {
          reporter: 'spec',
          require: ['lib-cov/test/globals.js']
        },
        src: ['lib-cov/test/spec/**/*.spec.js']
      },
      testpure: {
        options: {
          reporter: 'spec',
          require: ['test/globals.js']
        },
        src: ['test/spec/**/*.spec.js']
      },
      'htmlcov': {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'lib-cov/coverage.html',
          require: ['lib-cov/test/globals.js']

        },
        src: ['lib-cov/test/spec/**/*.js']
      },

    },

    coveralls: {
      options: {
        force: true
      },
      all: {
        src: './lib-cov/lcov.info'
      }
    },

    watch: {
      all: {
        files: ['**/*.js'],
        tasks: ['test']
      }
    }


  });

  grunt.registerTask('prepare', [ 'clean',
                                  'copy',
                                  'blanket'
                                ]);

  grunt.registerTask('test', [ 'jshint',
                               'mochaTest:testpure'
                              ]);

  grunt.registerTask('default', 'test');

  grunt.registerTask('cov', [ 'prepare',
                              'mochaTest:testLocal',
                              'mochaTest:htmlcov'
                            ]);


  grunt.registerTask('travis', [  'jshint',
                                  'prepare',
                                  'mochaTest:testForCoverage',
                                  'mochaTest:mocha-lcov-reporter',
                                   'mochaTest:travis-cov',
                                   'coveralls'
                                ]);
  grunt.registerTask('default', ['jshint', 'test']);

};