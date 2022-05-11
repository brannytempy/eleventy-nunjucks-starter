// tasks/minify-output.gulp.js

const { src, dest, series } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const jsMinify = require('terser').minify;

const OUTPUT_DIR = 'dist';

function minifyHtml() {
  return src(`../${OUTPUT_DIR}/**/*.js`)
    .pipe(
      htmlmin({
        // options offered by the library (lib)
        collapseWhitespace: true,
        useShortDoctype: true,
        removeComments: true,
        // lib supports inline CSS minification too
        minifyCSS: true,
        // lib support inline JS minification as well
        // with a catch, so we need to use terser instead
        minifyJS: (text, _) => {
          const res = jsMinify(text, { warnings: true });
          if (res.warnings) console.log(res.warnings);
          if (res.error) {
            console.log(text);
            throw res.error;
          }
          return res.code;
        },
      })
    )
    .pipe(dest(`../${OUTPUT_DIR}`));
}

exports.default = series(minifyHtml);