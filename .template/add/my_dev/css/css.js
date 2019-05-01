let isProduction;
const dir = "." + __dirname.replace(process.cwd(), "").replace(/\\/g, '/') + "/";

const fs = require('fs');
let gulp, config, css_dest;

module.exports = function (data) {
    init(data);

    return {
        watchDir: config.watchDir(),
        task: gulptaks,
        name: 'css'
    };
};

function init(data) {
    gulp = data.gulp;
    isProduction = data.is_production;

    if (!data.css_dest)
        throw new Error("process.env.css_dest not defined");

    css_dest = data.css_dest.replace(/\\/g, '/') + "/";
    if (!css_dest.endsWith('/'))
        css_dest = css_dest + "/";

    config = {
        scss: dir + 'scss/',
        font: css_dest + 'fonts',
        scss_src: [dir + 'scss/*.scss', `!${dir}scss/_*.scss`],
        css_dest,
        includePaths: ['node_modules/bootstrap/scss', dir + "scss/"],
        watchDir() { return this.scss_src; }
    }

}

const rename = require('gulp-rename'),
    print = require('gulp-print').default,
    sourcemaps = require('gulp-sourcemaps'),
    gulp_util = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    cache = require('gulp-cached');

function gulptaks() {
    let stream = gulp.src(config.scss_src)
        .pipe(cache())
        .pipe(sass({
            includePaths: config.includePaths
        })
            .on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(config.css_dest));

    if (isProduction) {
        return stream.pipe(print());
    } else {
        const cssnano = require('gulp-cssnano');

        return stream.pipe(sourcemaps.init())
            .pipe(cssnano())
            .pipe(rename(path => path.basename += '.min'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.css_dest))
            .pipe(print());
    }
};