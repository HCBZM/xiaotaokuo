const product = require('../service/product');
const cart = require('../service/cart');
const rest = require('../rest');

let fn_cart = ctx => {
    let cartInfo = cart.getCart();
    ctx.rest({
        myCartProducts: cartInfo
    })
};

let fn_add_product = ctx => {
    let pid = ctx.params.pid;
    let p = product.getProduct(pid);
    if (p === null) throw new rest.APIError('product:not_exist', '商品不存在!');
    let r = cart.addProduct(p);
    if (r === null) throw new rest.APIError();
    ctx.rest({
        state: 'success'
    })
}

let fn_del_products = ctx => {
    let body = ctx.request.body;
    cart.deleteProducts(body);
    ctx.rest({
        state: 'success'
    })
}

let fn_modify_product = ctx => {
    let data = ctx.request.body;
    let i = cart.queryProduct(ctx.params.pid);
    if (i === null) throw new rest.APIError('cart_product:not_exist', '购物车没有此产品！');
    cart.modifyProduct(i, data);
    ctx.rest({
        state: 'success'
    })
}

let fn_toggle_shop_choice = ctx => {
    let shopId = ctx.params.shopId
    cart.toggleIschoices(shopId, ctx.request.body.isChoice);
    ctx.rest();
}

let fn_toggle_all_choice = ctx => {
    cart.toggleIschoices('all', ctx.request.body.isChoice);
    ctx.rest();
}

module.exports = {
    'GET /api/cart': fn_cart,
    'POST /api/cart/product/:pid': fn_add_product,
    'DELETE /api/cart/delete': fn_del_products,
    'PUT /api/cart/product/:pid': fn_modify_product,
    'PUT /api/cart/shop/:shopId': fn_toggle_shop_choice,
    'PUT /api/cart/all': fn_toggle_all_choice,
}