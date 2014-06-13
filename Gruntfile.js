module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      pre: ["dist"],
      post: ["dist/jquery.<%= pkg.name %>-<%= pkg.version %>"]
    },

    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'js/jquery.<%= pkg.name %>.js', 'test/test.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },

    connect: {
      server: {
        options: {
          hostname: 'localhost'
        }
      }
    },

    blanket_qunit: {
      all: {
        options: {
          urls: ['http://localhost:8000/test/index.html?coverage=true&gruntReport'],
          threshold: 95
        }
      }
    },

    copy: {
      main: {
        files: [
          // Copy stylesheet and javascript
          {
            expand: true, 
            flatten: true,
            src: ['css/jquery.<%= pkg.name %>.css', 'js/jquery.<%= pkg.name %>.js'], 
            dest: 'dist/jquery.<%= pkg.name %>-<%= pkg.version %>/', 
            filter: 'isFile'
          },
        ]
      }
    },
// .
    cssmin: {
      // ext setting hacked to work around absorption of '.dynameter'.
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['jquery.<%= pkg.name %>.css', '!*.min.css'],
        dest: 'dist/jquery.<%= pkg.name %>-<%= pkg.version %>/',
        ext: '.<%= pkg.name %>-<%= pkg.version %>.min.css'
      }
    },

    uglify: {
      build: {
        src: 'js/jquery.<%= pkg.name %>.js',
        dest: 'dist/jquery.<%= pkg.name %>-<%= pkg.version %>/jquery.<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },

    usebanner: {
      main: {
        options: {
          position: 'top',
          banner: '/*! <%= pkg.title %> by <%= pkg.author.name %>\n*   <%= pkg.homepage %>\n*   v<%= pkg.version %>\n*   <%= grunt.template.today("yyyy-mm-dd") %>\n*   Copyright (c) 2014 Tzechiu Lei.  MIT license. */\n',
          linebreak: true
        },
        files: {
          src: 'dist/jquery.<%= pkg.name %>-<%= pkg.version %>/*'
        }
      }
    },

    compress: {
      main: {
        options: {
          archive: 'dist/jquery.<%= pkg.name %>-<%= pkg.version %>.zip',
          mode: 'zip'
        },
        files: [
          {
            expand: true, 
            cwd: 'dist/jquery.<%= pkg.name %>-<%= pkg.version %>', 
            src: ['**'], 
            dest: 'jquery.<%= pkg.name %>-<%= pkg.version %>/'
          }
        ]
      }
    },

    jquerymanifest: {
        options: {
            source: grunt.file.readJSON('package.json'),
            overrides: {
                title: "jQuery-DynaMeter",
                download: "http://tze1.com/dynameter/dist/jquery.<%= pkg.name %>-<%= pkg.version %>.zip"
            }
        }
    }
  });

  // Load the required plugins.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-blanket-qunit');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-jquerymanifest');

  // Grunt task(s).
  grunt.registerTask('default', [
    'clean:pre', 
    'jshint', 
    'connect', 
    'blanket_qunit:all', 
    'copy', 
    'cssmin', 
    'uglify',
    'usebanner', 
    'compress', 
    'clean:post',
    'jquerymanifest'
  ]);

  grunt.registerTask('test', [
    'jshint', 
    'connect', 
    'blanket_qunit:all'
  ]);
};