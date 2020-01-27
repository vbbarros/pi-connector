const router = require('express').Router()
const searchController = require('./connector/search/SearchController')
const moment = require('moment')
const momentTz = require('moment-timezone')


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

router.get('/momentTest',(req,res)=>{
  const tz = moment.tz.guess()
  const date = moment().tz(tz).format("YYYY-MM-DD HH:mm:ssZ")
  const selectedDate = (moment(date).tz(tz)).utc().format("YYYY-MM-DD HH:mm:ssZ")
  console.log(selectedDate)
  return res.json(
    {
      msg: selectedDate,
      zoned: date
    }
  )
})

module.exports = router
