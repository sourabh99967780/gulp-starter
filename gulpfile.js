const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask(){
  return src('app/scss/style.scss', { sourcemaps: true })
      .pipe(sass())
      .pipe(postcss([cssnano()]))
      .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask(){
  return src('app/js/main.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '.'
    }    
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Default Gulp Task
exports.default = series(
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask
);

// Watch Task
function watchTask(){
  watch('*.html', browsersyncReload);
  watch(['app/**/*.scss', 'app/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}