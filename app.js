const koa = require('koa');
const StaticCache = require('koa-static-cache');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const fs = require('fs');
var child = require('child_process');
var moment = require('moment');
var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
// var current_time=new Date().toLocaleString();


// var d=new Date(); //创建一个Date对象
// var localTime = d.getTime();
// var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数
// var utc = localTime + localOffset; //utc即GMT时间
// var offset =16; //以夏威夷时间为例，东10区
// var hawaii = utc + (3600000*offset);
// var current_time = new Date(hawaii);
console.log(current_time);


function getTimeByTimeZone(timeZone){
    var d=new Date();
        localTime = d.getTime(),
        localOffset=d.getTimezoneOffset()*60000, //获得当地时间偏移的毫秒数,这里可能是负数
        utc = localTime + localOffset, //utc即GMT时间
        offset = timeZone, //时区，北京市+8  美国华盛顿为 -5
        localSecondTime = utc + (3600000*offset);  //本地对应的毫秒数
        current_time = new Date(localSecondTime);
        console.log("根据本地时间得知"+timeZone+"时区的时间是 " + current_time.toLocaleString());
        console.log("系统默认展示时间方式是："+ d.toLocaleString())
}

getTimeByTimeZone(8)
console.log(current_time+'--');

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
    ctx.body = ``;
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



    let data = ctx.request.query || {};
    // data.requestip=ctx.request.header.host; 
    // data.Origin=ctx.request.header.Origin; 
    data.header=ctx.request.header;
    // data.ctx=ctx;
    data.remoteAddress=ctx.req.connection.remoteAddress;
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


 
router.post('/reset', async ctx => {
    var logss='fa';
    console.log(current_time+'重新发布12');
    
    
    child.exec('cd /data/jkins', function(err, sto,tr) {
        logss+=sto;console.log(logss+'--=== cd');

        child.exec('git pull', function(err, sto,tr) {
            logss+=sto;console.log(logss+'--=== git pull');

            child.exec('npm i', function(err, sto,tr) {
                logss+=sto;console.log(logss+'--=== npm i');

                child.exec('pm2 restart app', function(err, sto,tr) {
                    logss+=sto;console.log(logss+'--=== restart');
                });
            });
        });
    });

    console.log(logss);
    ctx.body = {
        code: 0,
        data: logss
    };
});


app.use( router.routes() );

app.listen(80);

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
})

console.log(current_time+'--启动成功---!!测试 99');

