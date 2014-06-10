module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      pre: ["dist"],
      post: ["dist/<%= pkg.name %>-<%= pkg.version %>"]
    },

    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'js/<%= pkg.name %>.js', 'test/test.js'],
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

    qunit: {
      files: ['test/index.html']
    },

    concat: {
      // Using concat to merly move files; project has only one css and one js file.
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist_css: {
        // the files to concatenate
        src: ['css/<%= pkg.name %>.css'],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      dist_js: {
        src: ['js/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.js'
      },
      dist_less: {
        // the files to concatenate
        src: ['css/<%= pkg.name %>.less'],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.less'
      }
    },

    cssmin: {
      // ext setting hacked to work around absorption of '.dynameter'.
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['jquery.dynameter.css', '!*.min.css'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/',
        ext: '.dynameter-<%= pkg.version %>.min.css'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %>.min.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },

    compress: {
      main: {
        options: {
          archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip',
          mode: 'zip'
        },
        files: [
          {expand: true, cwd: 'dist/<%= pkg.name %>-<%= pkg.version %>', src: ['**'], dest: '<%= pkg.name %>-<%= pkg.version %>/'}
        ]
      }
    }
  });

  // Load the required plugins.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Grunt task(s).
  grunt.registerTask('default', ['clean:pre', 'jshint', 'qunit', 'concat', 'cssmin', 'uglify', 'compress', 'clean:post']);
  grunt.registerTask('test', ['jshint', 'qunit']);
};