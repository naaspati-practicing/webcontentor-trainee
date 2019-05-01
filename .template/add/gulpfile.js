const chalk = require('chalk');
const Paths = require('path');

const dist_dir = "./src/";
const gulp = require('gulp');
const passValues = {
    dist_dir,
    css_dest:dist_dir+"css/",
    img_dir:dist_dir+"imgs/",
    html_dir:dist_dir,
    is_production:true,
    gulp
}

const common =  name => require(Paths.resolve("./my_dev", name, name.concat('.js')))(passValues); 
const css = () => common('css');
const pug = () => common('pug');

const taskName = process.argv[2] || 'default';

function addTasks(tasksNames, watchTasksNames, tasksFuncs) {
    if (!tasksNames.concat(watchTasksNames).includes(taskName))
        return;

    tasksFuncs = tasksFuncs.map(f => f());
    const tasks = tasksFuncs.map(f => {
        gulp.task(f.name, f.task);
        return f.name;
    });

    if (watchTasksNames.includes(taskName)) {
        const watchDirs = require('array-flatten')(tasksFuncs.map(f => f.watchDir));
        console.info(chalk.cyan('watching-dirs:\n '), watchDirs.join('\n  '), '\n');

        gulp.task(taskName, function () {
            tasksFuncs.map(f => gulp.watch(f.watchDir, gulp.series([f.name])));
        });
    } else if (!tasksFuncs.some(f => f.name === taskName)) {
        gulp.task(taskName, tasks);
    }
}
addTasks(['default', 'a', 'all'], ['wa', 'watch-all'], [css, pug]);
addTasks(['css', 'c'], ['watch-css', 'wc'], [css]);
addTasks(['pug', 'p'], ['watch-pug', 'wp'], [pug]);
