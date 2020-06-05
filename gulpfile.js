const { series, parallel, watch, lastRun } = require('gulp');
const { src, dest } = require('gulp');
const responsive = require('gulp-responsive');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
sass.compiler = require('sass');
const svgmin = require('gulp-svgmin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require("gulp-csso");


function css() {
    return src('./assets/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([ autoprefixer() ]))
      .pipe(csso({
        "comments": "exclamation",
      }))
      .pipe(dest('./_site/assets/css/'));
  }

function responsiveImages() {
    return src('./assets/images/*.{jpg,png,jpeg}', { since: lastRun(responsiveImages) })
      .pipe(responsive({
        '*': [
          {width: 800,},
          {width: 200, 
            rename: {
              suffix: '-w200'
            },
          },
          {width: 300, 
            rename: {
              suffix: '-w300'
            },
          },
          {width: 450, 
            rename: {
             suffix: '-w300'
            },
          },
          {width: 600, 
            rename: {
              suffix: '-w600'
            },
          },
          {width: 800, 
            rename: {
              suffix: '-w800'
            },
          },
          {width: 1000, 
            rename: {
             suffix: '-w1000'
            },
          },
          {width: 1000,
            rename: {
              suffix: '-card'
            },
          }
        ],
    }, {
      errorOnUnusedImage: false,
      passThroughUnused: true,
    }
    ))
    .pipe(imagemin())
    .pipe(dest('./_site/assets/images/'));
  }

  function svg() {
    return src('./assets/images/*.svg', { since: lastRun(svg) })
      .pipe(svgmin())
      .pipe(dest('./_site/assets/images/'));
  }
exports.dev = 
    parallel(
      responsiveImages,
      svg
  );
exports.build =
   parallel(
      css,
      responsiveImages,
      svg
    );
exports.css = 
  parallel(css);