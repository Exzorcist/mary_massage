let path = {
    files: {
        html: {
            cwd: './app/html/',
            src: '**/*.html',
        },
        style: {
            mobile: './app/style/mobile/**/*.less',
            desktop: './app/style/desktop/**/*.less',
        },
        js: {
            concat: './app/js/**/*.js',
            minify: {
                cwd: './build/js/',
                src: 'main.js',
            },
        },
        fonts: {
            cwd: './app/fonts/',
            src: '**/*',
        },
        images: {
            cwd: './app/images/',
            src: '**/*.{png,jpg,gif,svg}',
        },  
    },
    result: {
        html: './build/',
        style: {
            mobile: './build/css/style-m.css',
            desktop: './build/css/style-l.css',
        },
        js: {
            concat: './build/js/main.js',
            minify: './build/js/',
        },
        fonts: './build/fonts/',
        images: './build/images/',
    },
    watch: {
        html: './app/html/**/*',
        less: './app/style/**/*.less',
        fonts: './app/fonts/**/*',
        js: './app/js/**/*.js',
        image: './app/html/**/*.{png,jpg,gif,svg}',
    },
};

module.exports = function(grunt) {

    grunt.initConfig({
        html_imports: {
            all: {
                expand: true,
                cwd: path.files.html.cwd,
                src: path.files.html.src,
                dest: path.result.html
            }
        },

        copy: {
            fonts: {
                cwd: path.files.fonts.cwd,
                src: path.files.fonts.src,
                dest: path.result.fonts,
                expand: true
            }
        },

        less: {
            prod: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                    ],
                },
                sourceMap: true,
                files: {
                    [path.result.style.mobile]: path.files.style.mobile,
                    [path.result.style.desktop]: path.files.style.desktop
                },
            }
        },

        stylelint: {
            options: {
              configFile: '.stylelintrc',
              formatter: 'string',
              ignoreDisables: false,
              failOnError: true,
              outputFile: '',
              reportNeedlessDisables: false,
              fix: false,
              syntax: 'less'
            },
            src: [
                path.files.style.mobile,
                path.files.style.desktop
            ]
        },

        concat: {
            js: {
                src: path.files.js.concat,
                dest: path.result.js.concat,
            },
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                esversion: 6
            },
            target: [path.files.js.concat]
        },

        uglify: {
            prod: {
              files: [{
                expand: true,
                cwd: path.files.js.minify.cwd,
                src: path.files.js.minify.src,
                dest: path.result.js.minify
              }]
            }
        },

        image: {
            prod: {
              options: {
                optipng: false,
                pngquant: true,
                zopflipng: true,
                jpegRecompress: false,
                mozjpeg: true,
                gifsicle: true,
                svgo: true
              },
              files: [{
                expand: true,
                cwd: path.files.images.cwd,
                src: path.files.images.src,
                dest: path.result.images
              }]
            }
        },

        watch: {
            options: {
                livereload: 1337,
            },
            html: {
                files: path.watch.html,
                tasks: ['html_imports'],
            },
            less: {
                files: path.watch.less,
                tasks: ['css'],
            },
            fonts: {
                files: path.watch.fonts,
                tasks: ['copy:fonts'],
            },
            js: {
                files: path.watch.js,
                tasks: ['js'],
            },
            image: {
                files: path.watch.image,
                tasks: ['js'],
            },
        },

        connect: {
            server: {
                options: {
                    port: 9000,
                    base: './build',
                    hostname: '0.0.0.0',
                    protocol: 'http',
                    livereload: true,
                    open: true,
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat'); // [ grunt concat ]         --> for combine files
    grunt.loadNpmTasks('grunt-contrib-copy');   // [ grunt copy ]           --> for copy needing files to result folder 
    grunt.loadNpmTasks('grunt-html-imports');   // [ grunt html_imports ]   --> for use html templates
    grunt.loadNpmTasks('grunt-contrib-less');   // [ grunt less ]           --> convert less to css
    grunt.loadNpmTasks('grunt-stylelint');      // [ grunt stylelint ]      --> Validate less files
    grunt.loadNpmTasks('grunt-image');          // [ grunt image ]          --> compress images
    grunt.loadNpmTasks('grunt-contrib-uglify'); // [ grunt uglify ]         --> minify & combine js
    grunt.loadNpmTasks('grunt-contrib-jshint'); // [ grunt jshint ]         --> Validate js files
    grunt.loadNpmTasks('grunt-contrib-watch');  // [ grunt watch ]          --> Run predefined tasks whenever watched file patterns are added, changed or deleted
    grunt.loadNpmTasks('grunt-contrib-connect');// [ grunt connect ]        --> Start a connect web server

    grunt.registerTask('js', ['jshint', 'concat:js', 'uglify']);
    grunt.registerTask('css', ['stylelint', 'less']);
    grunt.registerTask('run', ['connect', 'watch']);
};
