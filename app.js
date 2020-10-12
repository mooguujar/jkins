const koa = require('koa');
const StaticCache = require('koa-static-cache');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const fs = require('fs');

/**
 * 通过服务器请求拿到一个基础页面，后续的内容就不要再通过浏览器发请求获取了
 * 因为通过浏览器发请求就会导致浏览器重新渲染，跳转，新开窗口
 * 
 * 首先通过浏览器拿到一个基础页面
 * 然后在基础页面中写入js，通过js的ajax来发送请求，ajax发送请求并不会直接渲染页面
 * 而是会把获取到的数据存储在ajax对象下
 */

let datas = JSON.parse(fs.readFileSync('./static/data/data.json'));

const app = new koa();

// 静态
app.use( StaticCache('./static', {
    prefix: '/static',
    gzip: true
}) );

// body 解析
app.use( BodyParser() );

const router = new Router();

router.get('/', async ctx => {
    ctx.body = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>404</h1>
    </body>
    </html>`;
});


router.get('/todos', async ctx => {
    // ctx.body = {x:1, y: 2}; //{"x":1, "y:2"}

    // ctx.body = datas.todos;

    ctx.body = {
        code: 0,
        data: datas.todos
    }
});

router.post('/toggle', async ctx => {
    let id = ctx.request.body.id || 0;

    if (!id) {
        ctx.body = {
            code: 1,
            data: '请传入id'
        }
        return;
    }

    let todo = datas.todos.find( todo => todo.id == id );
    todo.done = !todo.done;

    ctx.body = {
        code: 0,
        data: todo
    }

    fs.writeFileSync('./static/data/data.json', JSON.stringify(datas));
});

router.post('/remove', async ctx => {
    let obj = ctx.request.body || 0;
    
    if (!obj) {
        ctx.body = {
            code: 1,
            data: '请传入id'
        }
        return;
    }

    datas.todos = datas.todos.filter((todo,i) => {
        // var aa=i == obj.index||todo.id == obj.id||todo.aa == obj.aa||todo.username == obj.username;
        var aa=i == obj.index;
        return !aa;
    });

    // let todo = datas.todos.find( todo => todo.id == id );

    ctx.body = {
        code: 0,
        data: '删除成功'
    }

    fs.writeFileSync('./static/data/data.json', JSON.stringify(datas));
});

// router.post('/add', async ctx => {
router.get('/a', async ctx => {


    var request=ctx.request;

    let data = ctx.request.query || {};
    data.requestip=request.header.host; 
    // 添加ip地址
    
    


    // let title = ctx.request.body.title || '';
    // if (!title) {
    //     ctx.body = {
    //         code: 1,
    //         data: '请传入任务标题'
    //     }
    //     return;
    // }

    // let newTask = {
    //     id: ++datas._id,
    //     title,
    //     done: false
    // };

    // datas.todos.push(newTask);
    // ctx.body = {
    //     code: 0,
    //     data: newTask
    // }

    datas.todos.push(data);
    ctx.body = {
        code: 0,
        data: ''
    }

    fs.writeFileSync('./static/data/data.json', JSON.stringify(datas));
});

app.use( router.routes() );

app.listen(8011);
