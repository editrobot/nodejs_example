var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var http = require('http');
var path = require('path');

function getUpload(response, request,pathname) {//上传模块
	console.log("Request handler 'upload' was called.");
	
	var form = new formidable.IncomingForm();
	form.uploadDir="./tmp";
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		fs.renameSync(files.upload.path, "./tmp/test.png");
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("received image:<br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

function show(response, request,pathname) {
	console.log("Request handler 'show' was called.");
	fs.readFile("./tmp/test.png", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		}
		else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}

function postFileToServer(files,options){
	// var files = [
		// {urlKey: "images", urlValue: "00.jpg"}
	// ]
	// var options = { 
		// host: "localhost", 
		// port: "80" , 
		// method: "POST", 
		// path: "/uploader/s_upload.php"
	// }

	function postFileRun(fileKeyValue, req) {
		var boundaryKey = Math.random().toString(16);
		var enddata = '\r\n----' + boundaryKey + '--';

		var files = new Array();
		for (var i = 0; i < fileKeyValue.length; i++) {
			var content = "\r\n----" + boundaryKey + "\r\n" + "Content-Type: application/octet-stream\r\n" + "Content-Disposition: form-data; name=\"" + fileKeyValue[i].urlKey + "\"; filename=\"" + path.basename(fileKeyValue[i].urlValue) + "\"\r\n" + "Content-Transfer-Encoding: binary\r\n\r\n";
			var contentBinary = new Buffer(content, 'utf-8');//当编码为ascii时，中文会乱码。
			files.push({contentBinary: contentBinary, filePath: fileKeyValue[i].urlValue});
		}
		var contentLength = 0;
		for (var i = 0; i < files.length; i++) {
			var stat = fs.statSync(files[i].filePath);
			contentLength += files[i].contentBinary.length;
			contentLength += stat.size;
		}

		req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
		req.setHeader('Content-Length', contentLength + Buffer.byteLength(enddata));

		// 将参数发出
		var fileindex = 0;
		var doOneFile = function(){
			req.write(files[fileindex].contentBinary);
			var fileStream = fs.createReadStream(files[fileindex].filePath, {bufferSize : 4 * 1024});
			fileStream.pipe(req, {end: false});
			fileStream.on('end', function() {
				fileindex++;
				if(fileindex == files.length){
					req.end(enddata);
				} else {
					doOneFile();
				}
			});
		};
		if(fileindex == files.length){
			req.end(enddata);
		}else {
			doOneFile();
		}
	}

	//测试用例
	//http://nodejs.org/api/http.html#http_http_request_options_callback
	

	var req = http.request(options, function(res){
	// console.log("RES:" + res);
	// console.log('STATUS: ' + res.statusCode);
	// console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding("utf8");
	res.on("data", function(chunk){
	// console.log("BODY:" + chunk);
	})
	})

	// req.on('error', function(e){
	// console.log('problem with request:' + e.message);
	// console.log(e);
	// })

	postFileRun(files, req);

	// console.log("done");
}

exports.types = {
    "css": "text/css",
    "html": "text/html",
    "js": "text/javascript",
    "txt": "text/plain",
    "xml": "text/xml",
    "ico": "image/x-icon",
    "gif": "image/gif",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "svg": "image/svg+xml",
    "tiff": "image/tiff",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "json": "application/json",
    "pdf": "application/pdf",
    "swf": "application/x-shockwave-flash"
};
function test(){
	console.log("test");
	return "test ok";
}
exports.upload = getUpload;
exports.show = show;
exports.postFileToServer = postFileToServer;
exports.test = test;