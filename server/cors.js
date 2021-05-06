module.exports = () => {
    return async (ctx, next) => {
        // console.log(JSON.stringify(ctx.request.header, null, 4));
        if (ctx.request.header['origin'] !== void 0) {
            ctx.response.set('Access-Control-Allow-Origin', '*');
            // ctx.response.set('Access-Control-Allow-Credentials', 'true');
            // ctx.response.set('Set-Cookie', 'hcb=great')
            if (ctx.request.method === 'OPTIONS') {
                ctx.response.set({
                    'Access-Control-Allow-Headers': 'custom-filed, Content-Type',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                    'Access-Control-Max-Age': '600',
                    'Access-Control-Expose-Headers': 'Date, X-Response-Time, Set-Cookie'
                })
                ctx.response.body = null;
            } else {
                await next();
            }
        } else {
            await next();
        }
    }
};