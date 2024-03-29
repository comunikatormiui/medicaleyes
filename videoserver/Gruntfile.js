'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    project: {
      src: 'src',
      out: 'build',
    },
    time: {
      oneYear: 31557600,
      oneMonth: 2592000,
      oneWeek: 604800,
      oneDay: 86400,
      oneHour: 3600,
      oneMinute: 60
    },
    clean: {
      build: ['<%= project.out %>'],
      all: [
        '<%= project.out %>', '<%= project.src %>/bower_components',
        'node_modules'
      ]
    },
    jshint: {
      all: [
        'Gruntfile.js', '<%= project.src %>/**/*.js',
        '!<%= project.src %>/bower_components/**/*',
        '!<%= project.src %>/js/load-image.min.js',
        '!<%= project.src %>/js/canvas-to-blob.js'
      ],
      options: { jshintrc: '.jshintrc' }
    },
    copy: {
      structure: {
        files: [
          {
            expand: true,
            cwd: '<%= project.src %>',
            src: [
              'manifest.json', 'favicon.ico', 'css/**/*', 'views/**/*',
              'assets/**/*'
            ],
            dest: '<%= project.out %>'
          },
          {
            expand: true,
            cwd: '<%= project.src %>/bower_components/flag-icon-css',
            src: ['flags/**/*'],
            dest: '<%= project.out %>'
          },
          {
            src: '<%= project.src %>/templates/index.html',
            dest: '<%= project.out %>/index.html'
          },
          {
            src: '<%= project.src %>/js/load-image.min.js',
            dest: '<%= project.out %>/js/load-image.min.js'
          },
          {
            src: '<%= project.src %>/js/canvas-to-blob.js',
            dest: '<%= project.out %>/js/canvas-to-blob.js'
          }
        ]
      },
      scripts: {
        files: [{
          expand: true,
          cwd: '<%= project.src %>/bower_components',
          src: [
            'svg-morpheus/compile/minified/svg-morpheus.js',
            'underscore/underscore-min.js',
            'underscore/underscore-min.map',
            'flow.js/dist/flow.min.js',
            'ng-flow/dist/ng-flow.min.js',
            'angular/angular.min.js',
            'angular/angular.min.js.map',
            'angular-aria/angular-aria.min.js',
            'angular-aria/angular-aria.min.js.map',
            'angular-animate/angular-animate.min.js',
            'angular-animate/angular-animate.min.js.map',
            'angular-sanitize/angular-sanitize.min.js',
            'angular-sanitize/angular-sanitize.min.js.map',
            'angular-material/angular-material.min.js',
            'angular-route/angular-route.min.js',
            'angular-route/angular-route.min.js.map',
            'angular-messages/angular-messages.min.js',
            'angular-messages/angular-messages.min.js.map',
            'angular-translate/angular-translate.min.js',
            'angular-material-icons/angular-material-icons.min.js',
            'angular-simple-logger/dist/angular-simple-logger.min.js',
            'angular-google-maps/dist/angular-google-maps.min.js',
            'dicomParser/dist/dicomParser.min.js',
            'webrtc-adapter/release/adapter.js'
          ],
          dest: '<%= project.out %>/js',
          flatten: true
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: '<%= project.src %>/bower_components',
          src: ['angular-material/angular-material.min.css'],
          dest: '<%= project.out %>/css',
          flatten: true
        }]
      }
    },
    uglify: {
      options:
      { mangle: false, compress: { drop_console: true, sequences: false } },
      dist: {
        files: {
          '<%= project.out %>/js/app.js': [
            '<%= project.src %>/js/app.js',
            '<%= project.src %>/js/directives.js',
            '<%= project.src %>/js/controllers/*.js',
            '<%= project.src %>/js/services/*.js',
            '!<%= project.src %>/bower_components/**'
          ]
        }
      }
    },
    build: {
      default: {
        tasks: [
          'jshint', 'copy:structure', 'copy:scripts', 'copy:styles', 'uglify'
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerMultiTask(
    'build', 'Build for given environment',
    function (target) { return grunt.task.run(this.data.tasks); });
  grunt.registerTask('default', ['build']);
};
