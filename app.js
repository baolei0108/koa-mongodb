var Koa = require('koa');

var Router = require('koa-router');

var app = new Koa();
var router = new Router();


var bodyParser = require('koa-bodyparser')
//模板引擎
var views = require('koa-views');

//引入数据库
var DB = require('./modules/db/db.js');


//配置bodyParser 配置中间件
app.use(bodyParser());

//配置中间件 --第三方中间件
app.use(views('views',{
    extension: 'ejs'
}))


//注意：我们需要在每一个路由的render里面渲染一个公共的数据
/**
 * ctx.state = {
 * session: this.session,
 * title: 'app'
 * 
 * }
 */

//写一个中间件 用于渲染公共数据
app.use(async (ctx, next) => {
    ctx.state.userinfo = '张三';

    await next();

})




//koa中间件
//这个可以配置任何路由
// app.use(async (ctx) => {
//     ctx.body = '这是一个中间件';

// })


//想要匹配路由之前 打印之后 再往后匹配路由
app.use(async (ctx, next) => {
    // console.log(new Date());
    await next();

})


//错误处理中间件
// app.use(async (ctx, next)=> {
//      console.log('这是错误处理中间件');
//      next();  //开始执行后面的 路由匹配

//      //路由匹配执行完成之后 继续执行下面代码
//      if(ctx.status == 404) {
//          ctx.status = 404;
//          ctx.body = '这是一个404页面';
//      }else {
//          console.log(ctx.url);
//      }

// })


//配置路由
router.get('/', async(ctx, next) => {
    // ctx.body = '首页';

    let title = '你好 ejs';

    //获取数据库数据
    var result = await DB.find('user', {});

    //cookie
    ctx.cookies.set('name', 'zhangshan');

    //将数据库中的数据显示在页面上面
    await ctx.render('index', {
        title: title,
        list: result
    });


})

router.get('/news', async(ctx, next) => {
    // ctx.body = 'news';

    let arr = ['11', '22', '33'];
    let content = '<h2>这是一个h2标签</h2>';

    await ctx.render('news', {
        list: arr,
        content: content
    })

})

//增加学员
router.get('/add', async(ctx, next) => {
    //增加用户点击 增加用户
    await ctx.render('adduser');
})

//增加学员的操作
router.post('/doAdd', async(ctx, next) => {
    //将数据写进数据库
    var res = await DB.insert('user', ctx.request.body)

    //增加成功之后 让路由跳转到首页  否则跳转到/add页面继续添加
    try {
        if(res.result.ok == 1) {
            ctx.redirect('/')
        }

    }catch(err) {
        console.log(err);
        ctx.redirect('/add');

    }

})


//编辑页面
router.get('/edit', async(ctx, next) => {

    //根据传值 完成对数据库的数据编辑
    //获取该页面 带来的参数id
    var id = ctx.query.id;
    //获取到页面传过来的id的时候 去数据库获取该id对应的数据
    var json1 = await DB.find('user', {"_id": DB.getObjectid(id)});
    // console.log(json1);

    //拿到数据库中的数据之后 将数据填写在页面上面
    await ctx.render('edit', {
        list:json1[0]

    });

   
})

//获取编辑页面的数据 然后对数据库进行编辑操作
router.post('/doEdit', async(ctx, next) => {

    var json2 = ctx.request.body;
    var id = ctx.request.body.id;
    var name = ctx.request.body.name;

    var age = ctx.request.body.age;

     //更新数据库数据
    var res = await DB.update('user', {"_id": DB.getObjectid(id)}, json2);
    // console.log(res.result);

    //增加成功之后 让路由跳转到首页  否则跳转到/add页面继续添加
    try {
        if(res.result.ok == 1) {
            ctx.redirect('/')
        }

    }catch(err) {
        console.log(err);
        ctx.redirect('/edit');

    }
    

})

//删除
router.get('/delete', async(ctx, next) => {

    //获取页面上面的参数 id 然后在数据中删除 删除成功则返回首页
    // console.log(ctx.query.id);
    var id = ctx.query.id;

    //从数据库删除
    var res = await DB.remove('user', {"_id": DB.getObjectid(id)});
    // console.log(res.result);

    //增加成功之后 让路由跳转到首页  否则跳转到/add页面继续添加
    try {
        if(res.result.ok == 1) {
            console.log('删除数据成功')
            ctx.redirect('/')
        }

    }catch(err) {
        console.log(err);
        ctx.redirect('/');

    }

   
})


router.get('/newscontent', async(ctx, next) => {
    ctx.body = '新闻详情页';

})

//动态路由
router.get('/newscontent/:aid', async(ctx, next) => {

    // console.log(ctx.params);  //获取参数 返回 { aid: '1' }
    ctx.body = '新闻详情页';

})

//启动路由

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);