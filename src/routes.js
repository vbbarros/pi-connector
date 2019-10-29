const router = require('express').Router()
const searchController = require('./connector/search/SearchController')

router.get('/', (req, res)=>{
  return res.json({ message: 'Hello World' })
})

router.post('/search', (req, res)=>{
  const validation = req.body.validation || ''
  if(validation == "ihm123!@#"){
    return searchController.searchData(req, res)
  }else {
    res.status(401).send("Você não tem autorização para esta requisição")
  }
  
})

module.exports = router
