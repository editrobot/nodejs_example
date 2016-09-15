var http = require("http");
var url = require("url");
var fs = require("fs");
var cluster = require('cluster');
var os = require("os");//操作系统模块
var requestHandlers = require("./requestHandlers");
var RootDirectory = './www';
var index_file = {1:"index.html"};

function start() {
	function onRequest(request, response) {
		var postData = '';
		
		request.setEncoding('utf8');// 设置接收数据编码格式为 UTF-8
		
		// 接收数据块并将其赋值给 postData
		request.addListener('data', function(postDataChunk) {
			postData += postDataChunk;
		});

		request.addListener('end', function() {// 数据接收完毕，执行回调函数
		});
		
		var pathname = url.parse(request.url).pathname;//获取路径
		var query = url.parse(request.url,true).query//获取参数变量
		
		console.log(pathname);
		switch(pathname){
			case "/test":{
				response.writeHead(200, {"Content-Type": "text/html"});
				response.write(requestHandlers.test());
				response.end();
			}
			break;
			default:
				if(pathname == '/'){
					pathname = RootDirectory+pathname+index_file[1];
				}
				else{
					pathname = RootDirectory+pathname;
				}
				fs.exists(pathname,function(exists){
					if(!exists){
						console.log("No request handler found for " + pathname);
						response.writeHead(404, {"Content-Type": "text/html"});
						response.write("404 Not found");
						response.end();
					}else{
						console.log(pathname);
						var body = fs.readFileSync(pathname, "utf8");
						response.writeHead(200, {"Content-Type": "text/html"});
						response.write(body);
						response.end();
					}
				});
		}
	}
	
	http.createServer(onRequest).listen(8888,'127.0.0.1');//启动监听端口
	console.log("Server has started.");
}

exports.start = start;

//主机信息
////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.tmpdir = os.tmpdir();//操作系统临时文件夹
exports.hostname = os.hostname();//主机名
exports.type = os.type();//操作系统类型
exports.platform = os.platform();//操作系统平台
exports.arch = os.arch();//cpu架构
exports.release = os.release();//操作系统的release版本号
exports.uptime = os.uptime();//系统从启动到方法执行共经历多长时间
exports.loadavg = os.loadavg();//返回一个数据，数据元素依次为1分钟5分钟和15分钟的平均负载
exports.totalmem = os.totalmem();//内存总数，单位字节
exports.freemem = os.freemem();//内存总数，单位字节
exports.eol = os.EOL;//系统的行结束符是什么，windows为\r\n，unix和unix-like为\n，mac和ios为\r

exports.cpus = os.cpus();
//返回一个数组，数组每个元素为一个cpu核心的信息。

exports.networkInterfaces = os.networkInterfaces();
//返回一个二维数组，每一个内层数组代表一个网络接口（物理网卡或者虚拟网卡）
////////////////////////////////////////////////////////////////////////////////////////////////////////
