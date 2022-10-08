const { on } = require('gulp');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const { src, dest } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
var spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
var rename = require("gulp-rename");

gulp.task('server', function() {
    browserSync.init({
        server: {
            port:9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

// PUG
// exports.views = () => {
//     return src('source/templates/index.pug')
//       .pipe(
//         pug({
//           pretty: true
//         })
//       )
//       .pipe(dest('build'));
//   };
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/templates/index.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('build'))
  });

//   SASS
gulp.task('buildStyles', function () {
    return gulp.src('source/styles/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('build/css'));
  })
;

  //    spritesheet
  gulp.task('sprite', function () {
    var spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath:'../images/sprite.png',
      cssName: 'sprite.scss'
    }));
    return spriteData.img.pipe(gulp.dest('build/images/'));
    return spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
  });


//   delete
gulp.task('clean', function del(cb) {
    return rimraf('build', cb)
});

// copy fonts
gulp.task('copy:fonts', function(){
    return gulp.src('source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));

})

// copy images
gulp.task('copy:images', function(){
    return gulp.src('source/images/**/*.*')
    .pipe(gulp.dest('build/images'));

});

// copy

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// watchers

gulp.task('watch', function () {
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('buildStyles'))
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'buildStyles', 'sprite', 'copy'),
    gulp.parallel('watch', 'server' )
));