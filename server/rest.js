let rest = prefix => {
    return async (ctx, next) => {
        let path = ctx.request.path;
        if (path.startsWith(prefix + '/')) {
            ctx.rest = data => {
                ctx.response.type = 'application/json';
                ctx.response.body = data;
            }
            try {
                await next();
            } catch (e) {
                // 处理错误
                ctx.response.status = 400;
                ctx.response.type = 'application/json';
                ctx.response.body = {
                    code: e.code,
                    message: e.message
                };
            }
        } else {
            await next();
        }
    }
}

class APIError {
    constructor (code, message) {
        this.code = code || 'internal:unknown_err';
        this.message = message || '';
    }
}

module.exports = {
    rest,
    APIError
};