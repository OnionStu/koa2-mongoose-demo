var Demo = require('../models/demo')

const demoService = async (ctx, next) => {
  const title = 'koa2 title'
  console.log(ctx.request.body)
  var data = ctx.request.body
  if(data.text){
    var demo1 = new Demo(data)
    await demo1.save()
    let demos = await Demo.find()
    ctx.body = demos
  }else{
    throw new Error('no text!!!')
  }
}

module.exports = demoService