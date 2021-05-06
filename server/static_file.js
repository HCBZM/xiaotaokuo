let fs = require('mz/fs');
let path = require('path');
let mime = require('mime/lite');

module.exports = function (prefix, dir) {
    return async (ctx, next) => {
        let requestPath = ctx.request.path;
        if (requestPath.startsWith(prefix + '/')) {
            let filePath = path.join(dir, requestPath.substring(prefix.length));
            if (await fs.exists(filePath)) {
                ctx.response.type = mime.getType(requestPath);
                ctx.response.body = await fs.readFile(filePath);
            } else {
                ctx.response.status = 404;
            }
        } else {
            await next();
        }
    }
}