const update = require('update-json-file');
const name = require('path').basename(__dirname);

const array = ['src/css/styles.css', 'src/css/bootstrap4-compiled.css']

update('./angular.json', json => {
    json.projects[name].architect.build.options.styles = array;
    json.projects[name].architect.test.options.styles = array;

    return json;
}, { indent: '  ' });

const add_deps = {
    "eslint-config-google": "^0.12.0",
    "array-flatten": "^2.1.2",
    "bootstrap": "^4.3.1",
    "chalk": "^2.4.2",
    "cssnano": "^4.1.10",
    "eslint": "^5.16.0",
    "gulp": "^4.0.0",
    "gulp-autoprefixer": "^6.1.0",
    "gulp-cached": "^1.1.1",
    "gulp-cssnano": "^2.1.3",
    "gulp-filter": "^5.1.0",
    "gulp-html-prettify": "^0.0.1",
    "gulp-if": "^2.0.2",
    "gulp-open": "^3.0.1",
    "gulp-plumber": "^1.2.1",
    "gulp-print": "^5.0.2",
    "gulp-pug": "^4.0.1",
    "gulp-rename": "^1.4.0",
    "gulp-sourcemaps": "^2.6.5",
    "gulp-util": "^3.0.8",
    "lorem-ipsum": "^2.0.1",
    "popper.js": "^1.15.0",
    "jquery": "^3.4.0"
};

update('./temp-package.json', json0 => {
    const json = json0['devDependencies'];
    for (const key in add_deps) {
        if (add_deps.hasOwnProperty(key) && !json[key])
            json[key] = add_deps[key];
    }
    return json0;
});