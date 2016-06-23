module.exports = function (grunt) {

  // project configuration
  grunt.initConfig({
    clean: {
      coverage: ['coverage']
    },
    mocha_istanbul: {
      coverage: {
        print: 'none',
        quiet: true,
        excludes: [
          '**/coverage/**',
          '**/node_modules/**',
          '**/test/**'
        ],
        src: [
          'test/suite.js'
        ]
      }
    },
    mochaTest: {
      options: {
        slow: 1250,
        timeout: 3000,
        reporter: 'spec',
        ignoreLeaks: false
      },
      src: [
        'test/suite.js'
      ]
    }
  });

  // load grunt plugins for modules
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  // register tasks
  grunt.registerTask('coverage', ['clean:coverage','mocha_istanbul:coverage']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['mochaTest']);

};
