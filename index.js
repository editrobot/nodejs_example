var server = require("./server");
var requestHandlers = require("./requestHandlers");


console.log(new Date());//获取系统时间
console.log(new Date().getMonth()+ 1);
console.log(new Date().getDate());
console.log(new Date().getHours());
console.log(new Date().getMinutes());
console.log(new Date().getSeconds());
console.log(new Date().getMilliseconds());

//获取系统信息
console.log(server.tmpdir);
console.log(server.hostname);
console.log(server.type);
console.log(server.platform);
console.log(server.arch);
console.log(server.release);
console.log(server.uptime);

server.start();//启动服务器