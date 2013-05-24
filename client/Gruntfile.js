module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                files : [{
                    src: ['js/common/**/*.js', 'js/app.js', 'js/app/**/*.js'],
                    dest: 'build/<%= pkg.name %>.js'
                }]
            }
        }
        //,
//        uglify: {
//            options: {
//                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
//            },
//            dist: {
//                files: {
//                    'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
//                }
//            }
//        },
//        //qunit: {
//        //    files: ['test/**/*.html']
//        //},
//        jshint: {
//            files: ['gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
//            options: {
//                // options here to override JSHint defaults
//                globals: {
//                    console: true,
//                    module: true,
//                    document: true,
//                    angular : true
//                }
//            }
//        }
//        /*watch: {
//            files: ['<%= jshint.files %>'],
//            tasks: ['jshint', 'qunit']
//        }*/
    });

    //grunt.registerTask('test', ['jshint']);

    //grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('default', ['concat']);

};