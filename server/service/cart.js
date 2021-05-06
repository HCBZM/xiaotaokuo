const util = require('../util');
let shops = [
    {
        shopId: 1,
        log: '',
        title: '当当网',
    },
    {
        shopId: 2,
        log: '',
        title: '我的店铺',
    }
];
let products = [
    {shopId: 1,title: '盗墓笔记（套装全9册）', pid: '1', imgSrc: '/images/product/4.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '343.00', price: '216.00', number: 1, inventory: 230, isChoice: true},
    {shopId: 1,title: '小王子（名家全译本，原版插图精美再现，版语文教材阅读，傅雷翻译出版奖得主郑克鲁法语原文直译）', pid: '2', imgSrc: '/images/product/1.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '22.50', price: '9.90', number: 2, inventory: 1000, isChoice: true},
    {shopId: 2,title: '盗墓笔记（套装全9册）', pid: '333211', imgSrc: '/images/product/4.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '343.00', price: '216.00', number: 1, inventory: 230, isChoice: false},
    {shopId: 2,title: '小王子（名家全译本，原版插图精美再现，版语文教材阅读，傅雷翻译出版奖得主郑克鲁法语原文直译）', pid: '333213', imgSrc: '/images/product/1.jpg', keywords: [{id: 1, keyword: '当当自营'}, {id: 1, keyword: '券'}, {id: 1, keyword: '满减', importance: true}], prevPrice: '22.50', price: '9.90', number: 2, inventory: 1000, isChoice: true}
];

let addProduct = p => {
    let pIndex = products.findIndex(v => v.pid === p.pid);
    if (pIndex !== -1) {
        products[pIndex].number ++;
    } else {
        let shopId = shops[util.randomNumber(shops.length - 1)].shopId;
        p.shopId = shopId;
        p.isChoice = false;
        p.number = 1;
        p.inventroy = util.randomNumber(200, 800);
        products.push(p);
    }
}

let getCart = () => {
    if (products.length === 0) return [];
    let myCarts = [];
    for (let p of products) {
        let index = myCarts.findIndex(s => s.shopId === p.shopId);
        if (index === -1) {
            shop = shops.find(s => s.shopId === p.shopId);
            let data = {...shop, products: [p]};
            myCarts.push(data);
        } else {
            myCarts[index].products.push(p);
        }
    }
    return myCarts;
};

let deleteProducts = (pids) => {
    products = products.filter(v => !pids.includes(v.pid));
};

let queryProduct = id => {
    let index = products.findIndex(v => v.pid === id);
    return index === -1 ? null : index;
}

let modifyProduct = (i, data) => {
    let p = products[i];
    for (let prop in data) {
        p[prop] = data[prop];
    }
}

let toggleIschoices = (p, isChoice) => {
    if (p === 'all') 
        products.forEach(v => v.isChoice = isChoice);
    else 
        products.forEach(v => v.shopId == p && (v.isChoice = isChoice));
}

module.exports = {
    addProduct,
    getCart,
    deleteProducts,
    queryProduct,
    modifyProduct,
    toggleIschoices
}