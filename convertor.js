"use strict"

var fs = require('fs');
const EventEmitter = require('events');
const path = require('path');
var glob = require("glob")

const OfficeConvertor = require('./convertor/office');
const PdfConvertor = require('./convertor/pdf');

class Convertor extends EventEmitter
{
    constructor() {
        super();
        this.uploadDir = 'public/documents/' + Date.now();
    }

    process(document) {
        var that = this;
        fs.mkdirSync(this.uploadDir);
        this.document = this.uploadDir + '/' + document.name;
        document.mv(this.document, function(err){
            if(!err){
                that.emit('document.saved');
            }
        });
    }

    convert() {
        var convertor = null;
        switch (path.extname(this.document)) {
            case '.pdf':
                var that = this;
                convertor = new PdfConvertor();
                convertor.on('pdf.convert.img', (images) => {
                    //glob(that.uploadDir + '/*.png', {  }, function (er, images) {
                    that.emit('converted.img', images);
                    //});
                });
                break;
            default:
                convertor = new OfficeConvertor();
                convertor.on('doc.convert.pdf', (document) => {
                    this.document = document;
                    this.convert();
                });
        }
        convertor.document = this.document;
        convertor.convert();
    }

    registerEvent() {
        var that = this;
        this.on('document.saved', () => {
            that.convert();
        });

        return this;
    }
}

module.exports = Convertor;