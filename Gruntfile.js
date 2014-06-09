module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
        dest: 'dist/<%= pkg.name %>.css'
      },
      dist_js: {
        src: ['js/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      dist_less: {
        // the files to concatenate
        src: ['css/<%= pkg.name %>.less'],
        // the location of the resulting JS file
        dest: 'dist/<%= pkg.name %>.less'
      }
    },

    cssmin: {
      // ext setting hacked to work around absorption of '.dynameter'.
      minify: {
        expand: true,
        cwd: 'css/',
        src: ['jquery.dynameter.css', '!*.min.css'],
        dest: 'dist/',
        ext: '.dynameter.min.css'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>.min.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  // Load the required plugins.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Grunt task(s).
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'cssmin', 'uglify']);
  grunt.registerTask('test', ['jshint', 'qunit']);
};