"use strict";

var path = require('path');


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}


/* 环境信息 */
var evr = {
    product: true
}

/* src路径 */
var src = {
    Controller: ['./app/controller/**/*.js'],
    Directives: ['./app/directives/**/*.js'],
    Services: ['./app/services/**/*.js'],
    Filter: ['./app/filter/**/*.js'],
    APP: {
        Html: ['./app/front/*.html', 'app/store/*.html'],
        Css: ['./static/**/*.css'],
        Images: ['./static/images/**/*.jpg', 'static/images/**/*.png'],
        JS: ['./static/script/**/*.js'],
        Font: ['static/font/**/**', 'static/font2/**/**']
    },
    RevHtml: {
        revJson: './build/rev/**/*.json',
        source: './build/app/**/*.html'
    },
    RevCss: {
        revJson: './build/rev/**/*.json',
        source: './build/static/**/*.css'
    },
    RevJs: {
        revJson: './build/rev/**/*.json',
        source: './build/static/**/*.js'
    }
}


var zip = {
    name: '通行证二期' + getNowFormatDate() + '.zip',
    dir: './build/build_zip'
}

var output = {
    dist: './build'
}

var FileConfig = function () {
    this.src = src;
    this.evr = evr;
    this.path = path;
    this.output = output;
    this.zip = zip;
};

module.exports = new FileConfig();



