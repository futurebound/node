'use strict';

var querystring = require('querystring');
    fs = require('fs');
    formidable = require('formidable');

function start(res) {
  console.log(`Request handler 'start' was called.`);

  var body = '<html>' +
    '<head>' +
    '<meta http-equiv="Content-Type" content="text/html"; ' +
    '</head>' +
    '<body>' +
    '<form action="/upload" method="post">' +
    '<input type="file" name="upload" multiple="multiple">' +
    '<input type="submit" value="Upload File"/>' +
    '</form>' +
    '</body>' +
    '</html>';

  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(body);
  res.end();
}

function upload(res, req) {
  console.log(`Request handler 'upload' was called.`);

  var form = new formidable.IncomingForm();
  console.log('about to parse');
  form.parse(req, function(error, fields, files) {
      console.log('parsing done');
      fs.rename(files.upload.path, "/tmp/test.png", function(error) {
          if(error) {
              fs.unlink("/tmp/test.png");
              fs.rename(files.upload.path, "/tmp/test.png");
          }
      });
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write("received image:<br/>");
      res.write("<img src='/show' />");
      res.end();
  });
}

function show(res) {
    console.log("Request handler 'show' was called.");
    res.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("/tmp/test.png").pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;