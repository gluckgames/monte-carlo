/*eslint-env node */
"use strict";

var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("babel", function () {
    return gulp.src("./es6/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("./src"));
});

gulp.task("watch", ["babel"], function(){
    gulp.watch("./es6/**/*.js", ["default"]);
});

gulp.task("default", ["watch"]);
gulp.task("build", ["babel"]);
