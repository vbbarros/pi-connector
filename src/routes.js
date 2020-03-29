const router = require('express').Router()

const SearchAttributesController = require('./app/controllers/SearchAttributesController')

const SearchValidationMiddleware = require('./app/middlewares/SearchAttributesMiddleware')

router.use('/searchAttributes', SearchValidationMiddleware.validateJson)

router.get('/', (req, res)=>{
  return res.json({ message: 'Hello World' })
})

router.get('/healthz', (req, res)=>{
  return res.json({ message: 'true' })
})

router.post('/searchAttributes/values', SearchValidationMiddleware.validateDatesAndInterval, SearchAttributesController.searchAttributesValues)

router.post('/searchAttributes/webids', SearchAttributesController.searchAttributesWebids)

module.exports = router
