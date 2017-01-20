var Router = require('koa-router')
var indexCtrl = require('../controllers/indexCtrl')
var demoService = require('../services/demoService')

const router = Router()

router.get('/', indexCtrl)
router.post('/api/addDemo',demoService)

module.exports = router
