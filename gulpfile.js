const gulp = require("gulp");
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const Vinyl = require("vinyl");
const through2 = require("through2");
const cheerio = require("cheerio");
const path = require("path");
const { getStyledTime } = require("./util");

function svgstoreTask(done) {
  gulp
    .src("icons/*.svg")
    .pipe(
      svgmin(function(file) {
        const prefix = path.basename(
          file.relative,
          path.extname(file.relative)
        );
        return {
          plugins: [
            {
              cleanupIDs: {
                prefix: prefix + "-",
                minify: true
              }
            }
          ]
        };
      })
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(
      through2.obj(function(file, encoding, cb) {
        const $ = cheerio.load(file.contents.toString(), { xmlMode: true });
        const data = $("svg > symbol")
          .map(function() {
            return $(this).attr("id");
          })
          .get();
        const textFile = new Vinyl({
          path: "iconNames.txt",
          contents: Buffer.from(JSON.stringify(data))
        });
        this.push(textFile);
        this.push(file);
        cb();
      })
    )
    .pipe(gulp.dest("dest"));
  done();
  console.log(getStyledTime(), "\x1b[32mCreated svg symbols file");
}

exports.watch = function() {
  gulp.watch("icons/*.svg", svgstoreTask);
  console.log("\x1b[32m[READY]:", "\x1b[33mWatching for changes...");
};

exports.default = svgstoreTask;
