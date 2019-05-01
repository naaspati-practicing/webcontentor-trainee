const dir = "." + __dirname.replace(process.cwd(), "").replace(/\\/g, '/') + "/";

let gulp, html_dir, is_production;

module.exports = function (data) {
    ({ is_production, gulp, html_dir } = data);

    return {
        watchDir: [dir + '**/*', dir + '*'],
        task: task,
        name: 'pug'
    };
};

const gulp_util = require('gulp-util'),
    pug = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    open = require('gulp-open'),
    gulpif = require('gulp-if'),
    html_prettify = require('gulp-html-prettify'),
    print = require('gulp-print').default;

const data = {

};

function task() {
    // --file [common file name of .pug and .json/js file (without extension)]
    // if --file is specified 'index is is used by default'
    // --config [full name of the config file] 

    return gulp.src( [dir + '**/*.pug', '!'+dir + '**/_*.pug'] )
        .pipe(plumber({
            errorHandler(err) {
                console.log(err + '');
                this.emit('end');
            }
        }))
        .pipe(pug({
            basedir: dir,
            data,
            doctype: 'html'
        }))
        .pipe(plumber.stop())
        .pipe(gulpif(is_production, html_prettify({
            indent_char: ' ',
            indent_size: 4
        })))
        .pipe(gulp.dest(html_dir))
        .pipe(print())
        .pipe(gulpif(gulp_util.env.hasOwnProperty('open'), open()));
}