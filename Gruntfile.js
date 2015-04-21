'use strict';

// external helper modules
var path = require('path');
var wiredep = require('wiredep');

// fetch bower 3rd party libraries
// (scripts, stylesheets, fonts, images, etc...)
var BOWER_PATH = 'bower_components';

function ignoreBowerPath (file) { return path.relative(BOWER_PATH, file); }

var bower = {
  // javascripts
  js: (wiredep({
    directory: BOWER_PATH,
    exclude: ['jquery', 'bootstrap-sass-official']
  }).js || []).map(ignoreBowerPath),

  // stylesheets
  css: (wiredep({
    directory:  BOWER_PATH,
    exclude: ['fontawesome']
  }).css || []),

  // fonts
};

module.exports = function (grunt) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  require('jit-grunt')(grunt);

  // -- measures the time taken by each task
  require('time-grunt')(grunt);

  /**
   * Define tasks configuration.
   */
  var config = {

    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Define our distribution and deployment paths, as also
     * all of the application source files.
     */
    paths: {
      build: 'dist',
      deploy: '/var/www/<%= pkg.name %>'
    },

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * License: <%= pkg.licenses.type %> (<%= pkg.licenses.url %>)\n' +
        ' */'
    },

    /**
     * Checks source code for syntax errors and also
     * semantic errors and typos
     */
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js']
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: {
      build: '<%=paths.build%>/',
      deploy: '<%=paths.deploy%>/'
    },

    /**
     * Joins all of the application javascripts into only one script file.
     */
    concat: {
      options: {
        sourceMap: true,
        separator: ';\n\n',
        banner: '<%= meta.banner %>',
      },
      dist: {
        files: { '<%=paths.build%>/js/<%=pkg.name%>.js': ['src/**/*.js', 'obj/**/*.js'] }
      }
    },

    /**
     * Compiles/transforms Sass/SCSS files to a single CSS file.
     */
    sass: {
      dist: {
        files: { '<%=paths.build%>/css/<%=pkg.name%>.css': 'src/styles/main.scss' }
      }
    },

    /**
     * Minifies javascript/stylesheet files.
     */
    uglify: {
      options: {
        sourcemap: true,
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: { '<%=paths.build%>/js/<%=pkg.name%>.min.js': ['<%= concat.dist.dest %>'] }
      }
    },

    /**
     * Transpiles from ES6 to todays JavaScript standart ES5.
     */
    traceur: {
      options: {
        // traceur options here
        experimental: true,
      },
      six2five: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**/*.es6.js',
          dest: 'obj/',
          rename: function (dest, orig) {
            return dest + orig.replace('.es6.js', '.js');
          }
        }]
      }
    },

    /**
     * Trasfers application files from one point to target's destination.
     */
    copy: {
      dist: {
        files: [
          // -- assets (images, fonts, etc.)
          { expand: true, cwd: 'src/', src: ['images/**', 'favicon.ico'], dest: '<%=paths.build%>/' },

          // -- HTML templates
          { expand: true, cwd: 'src/', src: ['*.html'], dest: '<%=paths.build%>/' },
          { expand: true, cwd: 'src/app/', src: ['**/*.html'], dest: '<%=paths.build%>/js/' },

          // -- 3rd party vendor libraries (bower components)
          {
            expand: true,
            cwd: BOWER_PATH,
            src: [].concat(bower.js, bower.css),
            dest: '<%=paths.build%>/vendor/',
          },
          {
            expand: true,
            cwd: BOWER_PATH,
            src: ['**/fonts/*'],
            dest: '<%=paths.build%>/fonts',
            flatten: true,
          },
        ]
      },
    },

    /**
     * Checks for changes in source files and (re)runs tasks to update
     */
    watch: {
      conf: { files: ['Gruntfile.js'] },
      scss: { files: ['src/**/*.scss'], tasks: ['newer:sass'] },
      js:   { files: ['src/**/*.js', '!src/**/*.es6.js', 'obj/**/*.js'], tasks: ['newer:concat'] },
      es6:  { files: ['src/**/*.es6.js'], tasks: ['newer:traceur'] },
      html: { files: ['src/**/*.html'], tasks: ['newer:copy'] },
      dist: { files: ['<%=paths.build%>/**'], options: { livereload: true } },
    },

    connect: {
      server: {
        options: {
          port: 8080,
          base: '<%=paths.build%>/',
        }
      }
    },

    concurrent: {
      watch: {
        tasks: ['watch']
      },
      server: {
        tasks: ['connect']
      }
    },

  };

  /**
   * Inject configuration into grunt
   */
  grunt.initConfig(config);

  /**
   * Define project tasks.
   *  - `default` task is to build and compile;
   *  - `build` task gets your app ready to run for development and testing;
   */
  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', ['concat', 'sass', 'copy']);
  grunt.registerTask('deploy', ['rebuild', 'uglify', 'cssmin', 'copy']);

  // -- other handy tasks
  grunt.registerTask('dev', ['build', 'connect', 'watch']);
  grunt.registerTask('rebuild', ['clean:build', 'build']);
};