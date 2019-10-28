const requests = require('../RequestsPiServer')
const config = require('../../config')
const searchService = require('./SearchService')


const searchData = (req, res) =>  {

  const webid = req.body.name || '';
  const startDateTime = req.body.startDateTime || ''
  const endDateTime = req.body.endDateTime || ''
  const interval = req.body.interval || ''
  const elementsRequired = req.body.elements || ''
  var formatacao = '';
  var elements = '';
  searchService.validation({startDateTime, endDateTime, interval, elementsRequired})
    .then(function(response){
      return requests.searchAttributes(webid)
        .then(response => {
          searchService.formatData(startDateTime, endDateTime, interval)
          .then(resp =>{
            formatacao = resp
            searchService.filterElements(elementsRequired, config.elements, response.data.Items)
            .then(function(resp){
              elements = resp
              searchService.iteracaoAtributtes(elements, formatacao)
              .then(resp => {
                res.json(resp)
              }).catch(err => {
                res.status(400).send(`Erro ao buscar elementos: ${err.message}`)
              })
            }).catch(err => {
              res.status(400).send(`Erro ao filtrar elementos: ${err}`)
            })
          }).catch(err => {
            res.status(400).send(`Erro ao formatar dados: ${err.message}`)
          })
        })
        .catch(err => {
          if(err.response == undefined){
            res.status(400).send("Não foi possível conectar ao PI SERVER")
          } else {
            res.status(400).send(`Error: ${err.response.data.Errors}`)
          }
          //res.send(401).json(`messagem`)
        })
    }).catch(err => {
      res.status(400).send(`Erro na na validação: ${err}`)
    })
  
  
  }



module.exports = {
  searchData
}

