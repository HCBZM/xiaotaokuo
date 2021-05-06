const product = require('../service/product');

let fn_mime = ctx => {
    let products = product.getProductsList();
    ctx.rest({
        products
    })
};

module.exports = {
    'GET /api/mime': fn_mime
}