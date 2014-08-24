'use strict';

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    injector: 'grunt-asset-injector'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      client: require('./bower.json').appPath || 'client',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server/app.js'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      injectJS: {
        files: [
          '<%= yeoman.client %>/{app, complonents}/**/*.js',
          '!<%= yeoman.client %>/app/app.js'
        ],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: [
          '<%= yeoman.client %>/{app, complonents}/**/*.css'
        ],
        tasks: ['injector:css']
      },
      sass: {
        files: [
          '<%= yeoman.client %>/assets/**/*.{scss,sass}'],
        tasks: ['sass']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '<%= yeoman.client %>/assets/**/*.css',
          '<%= yeoman.client %>/{app,components}/**/*.html',
          '<%= yeoman.client %>/{app,components}/**/*.js',
          '<%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*',
            '!<%= yeoman.dist %>/.openshift',
            '!<%= yeoman.dist %>/Procfile'
          ]
        }]
      },
      server: '.tmp'
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: 'server/app.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      target: {
        src: '<%= yeoman.client %>/index.html',
        ignorePath: '<%= yeoman.client %>/'
      }
    },
    
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>',
          dest: '<%= yeoman.dist %>/public',
          src: './**/*'
        },{
          expand: true,
          dest: '<%= yeoman.dist %>',
          src: [
            'package.json',
            'server/**/*'
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass'
      ],
      debug: {
        tasks: [
          'nodemon'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'sass'
      ]
    },

    env: {
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // Compiles Sass to CSS
    sass: {
      server: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>/assets/sass',
          src: ['*.{sass, scss}'],
          dest: '<%= yeoman.client %>/assets/css',
          ext: '.css'
        }]
      }
    },

    injector: {
      options: {

      },
      scripts: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client', '');
            return '<script src="' + filePath + '"></script>';
          },
          startting: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
            '<%= yeoman.client %>/{app, complonents}/**/*.js'
          ]
        }
      },
      css: {
        options: {
          transform: function(filePath) {
            filePath = filePath.replace('/client', '');
            return '<link rel="stylesheet" href="' + filePath + '"></link>';
          },
          startting: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
            '<%= yeoman.client %>/{app, complonents}/**/*.css'
          ]
        }
      },
    }
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'clean:server',
      'env:all',
      'sass',
      'concurrent:server',
      'injector',
      'bowerInstall',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function(target) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'concurrent:test',
      ]);
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'sass',
    'concurrent:dist',
    'injector',
    'bowerInstall',
    'copy:dist'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
