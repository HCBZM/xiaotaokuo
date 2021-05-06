const Router = require('@koa/router');
const fs = require('fs');
const path = require('path');

const router = new Router;

function addMapping(router, mapping) {
    for (let url in mapping) {
        let path = '';
        if (url.startsWith('GET')) {
            path += url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST')) {
            path += url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('DELETE')) { 
            path += url.substring(7);
            router.delete(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else if (url.startsWith('PUT')) {
            path += url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir, pathPrefix) {
    let files = fs.readdirSync(dir);
    
    let js_files = files.filter(f => f.endsWith('.js'));
    
    for (let f of js_files) {
        console.log(`process controllers: ${f}...`);
        let mapping = require(dir + '/' + f);
        addMapping(router, mapping);
    }
}

module.exports = (dir) => {
    let controllerDir = dir || 'controllers'
    addControllers(router, path.join(__dirname, controllerDir));
    return router.routes();
}