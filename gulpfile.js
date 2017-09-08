/**
* 导入工具包 require('node_modules里对应模块')
*  require('gulp')
*
* 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
* gulp.task(name[, deps], fn)
*
* 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
* gulp.src(globs[, options])
*
* 处理完后文件生成路径
* gulp.dest(path[, options])
*
* 该任务调用的模块
* pipe
*
* **/

var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less'), //编译Less
    gulpif = require('gulp-if'), //if判断，用来区别生产环境还是开发环境的
    cssmin = require('gulp-minify-css'), //压缩css
    imagemin = require('gulp-imagemin'), //图片压缩
    rename = require('gulp-rename'), //文件重命名
    concat = require('gulp-concat'), //文件合并
    rev = require('gulp-rev'), //更改版本号
    clean = require('gulp-clean'), //删除
    htmlmin = require('gulp-htmlmin'),
    zip = require('gulp-zip'), //
    fontSpider = require('gulp-font-spider'),

    gulpWebpack = require('gulp-webpack'),
    webpack = require('webpack'),
    webpackConfig = null, //require('./webpack.config'),

    connect = require('gulp-connect'),
    runSequence = require('run-sequence').use(gulp), //队列
    minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify'), //混淆js
    revCollector = require('gulp-rev-collector'),
    watch = require('gulp-watch'),
    fileConfig = require('./FileConfig'); //基础配置

// 说明
gulp.task('help', function () {

    console.log('	gulp Less               编译Less并且压缩css');

    console.log('	gulp Controller         压缩混淆控制器');

    console.log('	gulp Directives         压缩混淆指令');

    console.log('	gulp Services           压缩混淆服务');

    console.log('	gulp CssConcat          合并压缩css');

    console.log('	gulp Css                压缩Css');

    console.log('	gulp JS                 压缩混淆js');

    console.log('	gulp Html               压缩html');

    console.log('	gulp Image              压缩image');

    console.log('	gulp clean              清空dist下的所有目录');

    console.log('	gulp AddRevCss          生成css改名配置文件');

    console.log('	gulp AddRevJs           生成js改名配置文件');

    console.log('	gulp AddRevController   生成controller改名配置文件');

    console.log('	gulp RevHtml            替换需要替换的文件');

    console.log('	gulp RevCss             替换需要替换的文件');

    console.log('	gulp RevJs              替换需要替换的文件');

    console.log('	gulp zip                打包文件');

    console.log('	gulp default            默认任务');

});

//编译Less并且压缩改名*.min.css
gulp.task('Less', function () {
    gulp.src(fileConfig.src.Less, { base: '.' }) //该任务针对的文件
        .pipe(rename({ suffix: '.min' }))
        .pipe(less()) //该任务调用的模块
        .pipe(cssmin()) //该任务调用的模块
        .pipe(gulp.dest(fileConfig.output.dist)); //将会在src/css下生成index.css
});

//压缩合并Css改名*.min.css
gulp.task('CssConcat', function () {
    gulp.src(fileConfig.src.Css, { base: '.' })
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssmin())
        .pipe(rev.manifest({ merge: true }))
        .pipe(concat(fileConfig.src.CssConcatName))
        .pipe(gulp.dest(fileConfig.output.dist))
});

//压缩混淆控制器
gulp.task('Controller', function () {
    return gulp.src(fileConfig.src.Controller, { base: '.' })
        .pipe(rev())  //设置hashcode作为后缀   set hash key
        .pipe(gulp.dest(fileConfig.output.dist))
        .pipe(uglify())
        .pipe(gulp.dest(fileConfig.output.dist));
});

//压缩混淆指令
gulp.task('Directives', function () {
    return gulp.src(fileConfig.src.Directives, { base: '.' })
        .pipe(gulp.dest(fileConfig.output.dist))
        .pipe(uglify())
        .pipe(gulp.dest(fileConfig.output.dist));
});

//压缩混淆服务
gulp.task('Services', function () {
    return gulp.src(fileConfig.src.Services, { base: '.' })
        .pipe(gulp.dest(fileConfig.output.dist))
        .pipe(uglify())
        .pipe(gulp.dest(fileConfig.output.dist));
});

//压缩混淆筛选器
gulp.task('Filter', function () {
    return gulp.src(fileConfig.src.Filter, { base: '.' })
        .pipe(gulp.dest(fileConfig.output.dist))
        .pipe(uglify())
        .pipe(gulp.dest(fileConfig.output.dist));
});

//压缩html
gulp.task('Html', function () {
    var options = {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    return gulp.src(fileConfig.src.APP.Html, { base: '.' })
        .pipe(htmlmin(options))
        .pipe(gulp.dest(fileConfig.output.dist))
});

//压缩Css、改版本
gulp.task('Css', function () {
    gulp.src(fileConfig.src.APP.Css, { base: '.' })
        .pipe(rev())
        .pipe(gulp.dest(fileConfig.output.dist))
        .pipe(cssmin())
        .pipe(gulp.dest(fileConfig.output.dist))
});

//打包字体
gulp.task('Font', function () {
    gulp.src(fileConfig.src.APP.Font, { base: '.' })
          .pipe(fontSpider())
          .pipe(gulp.dest(fileConfig.output.dist))
});

//压缩jpg、png图片
gulp.task('Image', function () {
    return gulp.src(fileConfig.src.APP.Images, { base: '.' })
        .pipe(rev())
        .pipe(gulpif(fileConfig.evr.product, imagemin()))
        .pipe(gulp.dest(fileConfig.output.dist));
});

//压缩混淆JS、改版本
gulp.task('JS', function () {
    return gulp.src(fileConfig.src.APP.JS, { base: '.' })
        .pipe(rev())
        .pipe(gulp.dest(fileConfig.output.dist))
        .pipe(uglify())
        .pipe(gulp.dest(fileConfig.output.dist));
});

//Css添加版本号
gulp.task('AddRevCss', function () {
    return gulp.src(fileConfig.src.APP.Css)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest(fileConfig.output.dist + '/rev/css'));
});

//JS添加版本号
gulp.task('AddRevJs', function () {
    return gulp.src(fileConfig.src.APP.JS)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest(fileConfig.output.dist + '/rev/js'));
});

//控制器添加版本号
gulp.task('AddRevController', function () {
    return gulp.src(fileConfig.src.Controller)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest(fileConfig.output.dist + '/rev/ctrl'));
});

//图片添加版本号
gulp.task('AddRevImages', function () {
    return gulp.src(fileConfig.src.APP.Images)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest(fileConfig.output.dist + '/rev/images'));
});

//Html版本替换
gulp.task('RevHtml', function () {
    return gulp.src([fileConfig.src.RevHtml.revJson, fileConfig.src.RevHtml.source])
    .pipe(revCollector(
        {
            replaceReved: true
        }
    ))
    .pipe(gulp.dest(fileConfig.output.dist + '/app'));
});

//Css版本替换
gulp.task('RevCss', function () {
    return gulp.src([fileConfig.src.RevCss.revJson, fileConfig.src.RevCss.source])
    .pipe(revCollector(
        {
            replaceReved: true
        }
    ))
    .pipe(gulp.dest(fileConfig.output.dist + '/static'));
});

//Js版本替换
gulp.task('RevJs', function () {
    return gulp.src([fileConfig.src.RevJs.revJson, fileConfig.src.RevJs.source])
    .pipe(revCollector(
        {
            replaceReved: true
        }
    ))
    .pipe(gulp.dest(fileConfig.output.dist + '/static'));
});

//打包
gulp.task('zip', function () {
    gulp.src(fileConfig.output.dist + '/**/**')
        .pipe(zip(fileConfig.zip.name))
        .pipe(gulp.dest(fileConfig.zip.dir));
});

//清空发布目录
gulp.task('clean', function () {
    return gulp.src(fileConfig.output.dist + '/*', { read: false })
        .pipe(clean());
});


//默认执行
gulp.task('build:R5E3', function (cb) {
    runSequence('clean', 'Controller', 'Directives', 'Services', 'Filter', 'Html', 'Css', 'Font', 'JS', 'Image', 'AddRevJs', 'AddRevController', 'AddRevCss', 'AddRevImages', 'RevHtml', 'RevCss', 'RevJs', 'zip', cb);
});




