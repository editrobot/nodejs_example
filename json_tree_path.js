var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/test"] = requestHandlers.test;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["/postFileToServer"] = requestHandlers.postFileToServer;

exports.handle = handle;