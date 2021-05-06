let deeplyCopy = require('../util').deeplyCopy;

const productsList = [
    {title: '盗墓笔记（套装全9册）', pid: '1', imgSrc: '/images/product/4.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '343.00', price: '216.00'},
    {title: '小王子（名家全译本，原版插图精美再现，版语文教材阅读，傅雷翻译出版奖得主郑克鲁法语原文直译）', pid: '2', imgSrc: '/images/product/1.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '22.50', price: '9.90'},
    {title: '挪威的森林（2018年新版，村上春树的残酷青春物语，现象级的超级畅销书，三十周年纪念版）', pid: '3', imgSrc: '/images/product/3.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '37.20', price: '38.00'},
    {title: '外婆的道歉信（畅销100万册，马思纯领读书目。人民日报、央视好评。张皓宸、七英俊推荐。口碑爆棚的温情小说。附赠一封神秘道歉信）', pid: '4', imgSrc: '/images/product/6.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '41.10', price: '42.00'},
    {title: '找到一个好朋友-学会珍惜友情-青蛙弗洛格的成长故事9787535830340湖南少年儿童出版社[荷兰]马克斯·维尔', pid: '5', imgSrc: '/images/product/8.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '167.00', price: '37.10'},
    {title: '新课标 边城（沈从文代表作）', pid: '6', imgSrc: '/images/product/7.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '32.00', price: '26.40'}
];
for (let i = 0; i < 50; i ++) {
    let list = productsList.slice(i * 6, i * 6 + 6);
    list = deeplyCopy(list);
    list.forEach(v => v.pid = (+ v.pid + 6).toString());
    productsList.push(...list);
}

let getProduct = id => {
    let index = productsList.findIndex(v => v.pid === id);
    if (index === -1) return null;
    return productsList[index];
}

let getProductsList = (offset = 0, limit = 6) => {
    if (offset >= productsList.length) return null;
    return productsList.slice(offset, offset + limit);
}

module.exports = {
    getProduct,
    getProductsList
}