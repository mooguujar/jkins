const nodemailer = require('nodemailer'); //引入模块
let transporter = nodemailer.createTransport({
    //node_modules/nodemailer/lib/well-known/services.json  查看相关的配置，如果使用qq邮箱，就查看qq邮箱的相关配置
    // service: 'qq', //类型qq邮箱
    // port: 465,
    // secure: true, // true for 465, false for other ports

    // host : 'smtp.sina.com',
    // secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）

    host: 'smtp.qq.com',
    secureConnection: true, // use SSL
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: '1162212711@qq.com', // 发送方的邮箱
        pass: 'amdhrtrcbjstjhfc' // smtp 的授权码
    }
});
//pass 不是邮箱账户的密码而是stmp的授权码（必须是相应邮箱的stmp授权码）
//邮箱---设置--账户--POP3/SMTP服务---开启---获取stmp授权码

function sendMail(mail, code, call) {
    // 发送的配置项
    let mailOptions = {
        from: '"Express-demo" <1162212711@qq.com>', // 发送方
        to: mail, //接收者邮箱，多个邮箱用逗号间隔
        subject: '欢迎来到"Express-demo"', // 标题
        text: 'Hello world?', // 文本内容
        html: '<p>这里是"Express-demo"详情请点击:</p><a href="https://www.jianshu.com/u/5cdc0352bf01">点击跳转</a>', //页面内容
        // attachments: [{//发送文件
        //      filename: 'index.html', //文件名字
        //      path: './index.html' //文件路径
        //  },
        //  {
        //      filename: 'sendEmail.js', //文件名字
        //      content: 'sendEmail.js' //文件路径
        //  }
        // ]
    };

    //发送函数
    transporter.sendMail(mailOptions, (error, info) => {

        // console.log('------------error, info');
        // console.log(error, info);
        
        if (error) {
            call(false)
        } else {
            call(true) //因为是异步 所有需要回调函数通知成功结果
        }
    });

}

module.exports = {
    sendMail
}
