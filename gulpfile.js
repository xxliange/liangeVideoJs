const gulp = require('gulp'),
    rollup = require('rollup'),
    fs = require('fs'),
    path = require('path'),
    gulpReplace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    cssmin = require('gulp-cssmin'),
    cssgrace = require('cssgrace'),
    autoprefixer = require('autoprefixer'),
    rename = require('gulp-rename'),
    resolve = require('rollup-plugin-node-resolve'),
    babel = require('rollup-plugin-babel');

gulp.task('css', async()=>{
    gulp.src('./src/css/**/*.css')
    .pipe(concat('liangeVideoJs.css'))
    .pipe(postcss([
        autoprefixer,
        cssgrace
    ]))
    .pipe(gulp.dest('./build'))
    .pipe(rename('liangeVideoJs.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./build'))
});

gulp.task('script', async()=>{
    await rollup.rollup({
        input:'./src/js/index.js',
        plugins:[
            resolve(),
            babel({
                exclude:'node_modules/**'
            })
        ]
    })
    .then(bundle=>{
        bundle.write({
            file:'./build/liangeVideoJs.js',
            format:'umd',
            name:'liangeVideoJs',
        })
        .then(()=>{
            gulp.src('./build/liangeVideoJs.js')
            .pipe(gulpReplace(/__INLINE_CSS__/gm, function(){
                var filePath = path.resolve(__dirname, 'build', 'liangeVideoJs.css'),
                    content = fs.readFileSync(filePath).toString('utf-8');
                    content = content.replace(/\n/g, '').replace(/\\/g, '\\\\').replace(/'/g, '\\\'');
                    return content; 
            }))
            .pipe(gulp.dest('./build'))
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename('liangeVideoJs.min.js'))
            .pipe(sourcemaps.write(''))
            .pipe(gulp.dest('./build'))
        })
    })
});

gulp.task('default', gulp.parallel(['script', 'css'], ()=>{
    gulp.watch('./src/js/**/*.js', gulp.series('script'));
    gulp.watch('./src/css/**/*.css', gulp.parallel('css', 'script'));
}));

gulp.task('build', gulp.parallel(['script', 'css']));