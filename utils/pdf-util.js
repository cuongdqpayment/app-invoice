"use strict"

var arrObject = require('./array-object');

const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Ham nay se tao ra 1 file pdf tu du lieu vao
 * ket qua la mot file pdf co nen la background va cac toa do de su dung CANH TOA DO dung tao mask cho ham createPdf
 * @param {*} inputConfig {config: {matrix_point: {...}, background:{...}, page_config, color_default, title, author}}
 * @param {*} fileName 
 */
var createPdfPoint = (inputConfig, fileName) => {

    var config = {
        matrix_point: {
            max_row: (inputConfig.config && inputConfig.config.matrix_point && inputConfig.config.matrix_point.max_row) ? inputConfig.config.matrix_point.max_row : 20, //so luong dong
            max_col: (inputConfig.config && inputConfig.config.matrix_point && inputConfig.config.matrix_point.max_col) ? inputConfig.config.matrix_point.max_col : 10, // so luong cot
            zipper_row: (inputConfig.config && inputConfig.config.matrix_point && inputConfig.config.matrix_point.zipper_row) ? inputConfig.config.matrix_point.zipper_row : 20, //khoang cach giua 2 dong
            zipper_col: (inputConfig.config && inputConfig.config.matrix_point && inputConfig.config.matrix_point.zipper_col) ? inputConfig.config.matrix_point.zipper_col : 60, //khoang cach giua 2 cot
        },
        background: {
            image: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.image) ? inputConfig.config.background.image : './pdf/Backgroud-Giay-moi-2019.jpg',
            left: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.left) ? inputConfig.config.background.left : -5,
            top: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.top) ? inputConfig.config.background.top : -3,
            width: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.width) ? inputConfig.config.background.width : 610,
            height: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.height) ? inputConfig.config.background.height : 845
        },
        page_config: {
            size: (inputConfig.config && inputConfig.config.page_config && inputConfig.config.page_config.size) ? inputConfig.config.page_config.size : 'A4',
            margin: (inputConfig.config && inputConfig.config.page_config && inputConfig.config.page_config.margin) ? inputConfig.config.page_config.margin : 0,
            layout: (inputConfig.config && inputConfig.config.page_config && inputConfig.config.page_config.layout) ? inputConfig.config.page_config.layout : 'portrait'
        },
        text_config: {
            size: (inputConfig.config && inputConfig.config.text_config && inputConfig.config.text_config.size) ? inputConfig.config.text_config.size : 12,
            color: (inputConfig.config && inputConfig.config.text_config && inputConfig.config.text_config.color) ? inputConfig.config.text_config.color : "blue",
        },
        title: (inputConfig.config && inputConfig.config.title) ? inputConfig.config.title : "mau giay moi sample",
        author: (inputConfig.config && inputConfig.config.author) ? inputConfig.config.author : "intenet"
    };


    //khoi tao rows, cols and matrix
    var matrix = [];
    for (let row = 0; row < config.matrix_point.max_row; row++) {
        for (let col = 0; col < config.matrix_point.max_col; col++) {
            matrix.push({
                x: col * config.matrix_point.zipper_col, //giãn cột
                y: row * config.matrix_point.zipper_row, //giãn dòng
                value: '(' + (row * config.matrix_point.zipper_row) + ',' + (col * config.matrix_point.zipper_col) + ')'
            })
        }
    }

    var doc = new PDFDocument(
        config.page_config
    );

    var stream = doc.pipe(fs.createWriteStream(fileName));

    doc.info['Title'] = config.title;
    doc.info['Author'] = config.author;

    //in nen de canh
    if (config.background && config.background.image) doc.image(config.background.image, config.background.left, config.background.top, { width: config.background.width, height: config.background.height });

    doc.registerFont('Time-new-roman-utf8', './fonts/times.ttf');
    doc.font('Time-new-roman-utf8');

    doc.fontSize(config.text_config.size);
    doc.fillColor(config.text_config.color);

    matrix.forEach(el => {
        doc.text(el.value, el.x, el.y
        );
    });
    doc.end();
}


/**
 * Ham nay se tao ra 1 file pdf tu du lieu vao
 * @param {*} inputConfig {config: {background:{...}, page_config, color_default, title, author}, mask:{},list_data: [{data same mask}] }
 * @param {*} fileName 
 */
var createPdf = (inputConfig, fileName) => {
    var config = {
        background: {
            image: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.image) ? inputConfig.config.background.image : './pdf/Backgroud-Giay-moi-2019.jpg',
            left: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.left) ? inputConfig.config.background.left : -5,
            top: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.top) ? inputConfig.config.background.top : -3,
            width: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.width) ? inputConfig.config.background.width : 610,
            height: (inputConfig.config && inputConfig.config.background && inputConfig.config.background.height) ? inputConfig.config.background.height : 845
        },
        page_config: {
            size: (inputConfig.config && inputConfig.config.page_config && inputConfig.config.page_config.size) ? inputConfig.config.page_config.size : 'A4',
            margin: (inputConfig.config && inputConfig.config.page_config && inputConfig.config.page_config.margin) ? inputConfig.config.page_config.margin : 0,
            layout: (inputConfig.config && inputConfig.config.page_config && inputConfig.config.page_config.layout) ? inputConfig.config.page_config.layout : 'portrait'
        },
        text_config: {
            size: (inputConfig.config && inputConfig.config.text_config && inputConfig.config.text_config.size) ? inputConfig.config.text_config.size : 12,
            color: (inputConfig.config && inputConfig.config.text_config && inputConfig.config.text_config.color) ? inputConfig.config.text_config.color : "blue",
        },
        title: (inputConfig.config && inputConfig.config.title) ? inputConfig.config.title : "mau giay moi",
        author: (inputConfig.config && inputConfig.config.author) ? inputConfig.config.author : "intenet"

    };


    var pagesPrint = [];
    inputConfig.list_data.forEach(kh => {
        pagesPrint.push(arrObject.getMatrix(inputConfig.mask, kh, { col: 0, row: 0 }));
    })

    //console.log(pagesPrint);

    var doc = new PDFDocument(
        config.page_config
    );

    var stream = doc.pipe(fs.createWriteStream(fileName));

    doc.info['Title'] = config.title;
    doc.info['Author'] = config.author;

    doc.registerFont('Time-new-roman-utf8', './fonts/times.ttf');
    doc.font('Time-new-roman-utf8');

    
    
    pagesPrint.forEach((page, idx) => {
        
        if (idx > 0) doc.addPage();
        
        doc.fontSize(config.text_config.size);
        doc.fillColor(config.text_config.color);

        if (config.background && config.background.image) doc.image(config.background.image, config.background.left, config.background.top, { width: config.background.width, height: config.background.height });
        
        page.forEach(point => {
            if (point.color) doc.fillColor(point.color);
            doc.text(point.value, point.col, point.row);
            doc.fillColor(config.text_config.color);
        })

    })
    doc.end();
}

module.exports = {
    createPdf: createPdf,
    createPdfPoint: createPdfPoint
};