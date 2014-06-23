module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }        
      }
    },
    uglify: {
      prod: {
        files: {
          'js/website.min.js': ['src/js/*.js'],
          'js/media.min.js': [
            'bower_components/modernizr/modernizr.js',
          ],
          
          'js/foundation.min.js': [
            'bower_components/foundation/js/vendor/jquery.js',
            'bower_components/foundation/js/foundation/foundation.js',
            //'src/bower_components/foundation/js/foundation/foundation.abide.js',
            //'src/bower_components/foundation/js/foundation/foundation.accordion.js',
            'bower_components/foundation/js/foundation/foundation.clearing.js',
            'bower_components/foundation/js/foundation/foundation.dropdown.js',
            'bower_components/foundation/js/foundation/foundation.interchange.js',
            //'src/bower_components/foundation/js/foundation/foundation.joyride.js',
            //'src/bower_components/foundation/js/foundation/foundation.magellan.js',
            //'src/bower_components/foundation/js/foundation/foundation.offcanvas.js',
            //'src/bower_components/foundation/js/foundation/foundation.orbit.js',
            //'src/bower_components/foundation/js/foundation/foundation.reveal.js',
            //'src/bower_components/foundation/js/foundation/foundation.tab.js',
            //'src/bower_components/foundation/js/foundation/foundation.tooltips.js',
            'bower_components/foundation/js/foundation/foundation.topbar.js'
          ]
        }
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      },
	  
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['sass', 'uglify']);
  grunt.registerTask('default', ['build','watch']);
}