const product = require('../service/product');
const APIError = require('../rest').APIError;

let fn_index = ctx => {
    let body = {
        banners: [
            {
                id: 1,
                imgSrc: '/images/banner/2.jpg',
            }, {
                id: 2,
                imgSrc: '/images/banner/3.jpg',
            }, {
                id: 3,
                imgSrc: '/images/banner/2.jpg',
            }
        ],
        cards: [
            {imgSrc: '/images/icon/books.png', url: '', text: '图书'},
            {imgSrc: '/images/icon/kid-books.png', url: '', text: '童书'},
            {imgSrc: '/images/icon/plan.png', url: '', text: '读书计划'},
            {imgSrc: '/images/icon/clothes.png', url: '', text: '巴拉巴拉'},
            {imgSrc: '/images/icon/lucky-draw.png', url: '', text: '免费抽大奖'},
            {imgSrc: '/images/icon/signin.png', url: '', text: '阅读打卡'},
            {imgSrc: '/images/icon/reading.png', url: '', text: '当读'},
            {imgSrc: '/images/icon/red-packet.png', url: '', text: '拆现金红包'},
            {imgSrc: '/images/icon/supermarket.png', url: '', text: '当当超市'},
            {imgSrc: '/images/icon/get-money.png', url: '', text: '打卡领钱'},
            {imgSrc: '/images/icon/gift.png', url: '', text: '0元领物'},
            {imgSrc: '/images/icon/bargain.png', url: '', text: '一元砍价'},
            {imgSrc: '/images/icon/moneybag.png', url: '', text: '天天领现金'},
            {imgSrc: '/images/icon/run.png', url: '', text: '步数赚钱'},
            {imgSrc: '/images/icon/free-reading.png', url: '', text: '免费读书'},
            {imgSrc: '/images/icon/group-purchase.png', url: '', text: '超值拼团'},
            {imgSrc: '/images/icon/school.png', url: '', text: '当当校园'},
            {imgSrc: '/images/icon/second-kill.png', url: '', text: '秒杀1元抢'}
        ],
        groupBuy: [
            {id: '3', cur: '33', total: '50', imgSrc: '/images/product/5.jpg',prevPrice: '61.8', curPrice: '25.5'},
            {id: '40', cur: '12', total: '20', imgSrc: '/images/product/6.jpg',prevPrice: '268.8', curPrice: '123.5'},
        ],
        productsTabs: [
            ['100减50', '精选'],
            ['1.9折起', '童书'],
            ['超值拼团', '精选好物'],
            ['9.9包邮', '低价专区'],
            ['88元10件', '特价书市'],
            ['特惠', '自营图书'],
            ['限时抢', '折扣图书'],
            ['99元5件', '英文图书'],
        ]
    };
    body.products = product.getProductsList();
    ctx.rest(body);
}

let fn_index_products = ctx => {
    let limit = ctx.params.limit || 6;
    let offset = ctx.params.offset || 0;
    let products = product.getProductsList(+ offset, + limit);
    if (products === null) throw new APIError('products:no_more', '没有更多了!');
    ctx.rest({
        products
    });
}

let fn_get_product = ctx => {
    let p = product.getProduct(ctx.params.id);
    if (p === null) throw new rest.APIError({code: 'product:not_found', message: '商品不存在！'});
    ctx.rest({
        p
    })
}

module.exports = {
    'GET /api/index': fn_index,
    'GET /api/index/products/:offset/:limit': fn_index_products,
    'GET /api/product/:id': fn_get_product
}