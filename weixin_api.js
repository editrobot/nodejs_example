function get_access_token(){ //获取
	console.log(global.weixin);
	++global.weixin["numberOfTimes"]; //次数递增
	++global.weixin["id"];
	console.log(global.weixin);
	return 0;
}
exports.get_access_token = get_access_token;