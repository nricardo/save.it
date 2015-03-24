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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

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
        files: { '<%=paths.build%>/js/<%=pkg.name%>.js': ['src/**/*.js'] }
      }
    },

    /**
     * Compiles/transforms Sass/SCSS files to a single CSS file.
     */
    sass: {
      dist: {
        files: { '<%=paths.build%>/css/<%=pkg.name%>.css': 'src/scss/style.scss' }
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
     * Trasfers application files from one point to target's destination.
     */
    copy: {
      build: {
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
      scss: { files: ['src/**/*.scss'], tasks: ['sass'] },
      js:   { files: ['src/**/*.js'], tasks: ['concat'] },
      html: { files: ['src/**/*.html'], tasks: ['copy:build'] },
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

  grunt.registerTask('build', ['clean:build', 'concat', 'sass', 'copy:build']);
  grunt.registerTask('deploy', ['clean:deploy', 'uglify', 'cssmin', 'copy:deploy']);
};