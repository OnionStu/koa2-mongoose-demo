module.exports = async (ctx, next) => {
  // const title = 'koa2 title'
  // await ctx.render('index', {
  //   title,
  // })
  ctx.body = "Hello Koa + MongoDB"
}
