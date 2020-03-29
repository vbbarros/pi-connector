const requests = require('../utils/RequestsPiServer')
const SearchAttributesService = require('../services/SearchAttributesService')

const searchAttributesValues = (req, res) => {
  try{
    var typeOfSearch = SearchAttributesService.verifyTypeOfSearch(req.body.isSubattribute)
  } catch(err){
    return res.status(400).send(err.message)
  }

  requests.searchAttributes(req.body.webid, typeOfSearch.path).then(response => {
      _getAttributesValue(req.body.startDateTime, req.body.endDateTime, req.body.interval, response.data.Items);
  })
  .catch(err => {
    if (err.response == undefined) {
      return res.status(400).send("Não foi possível conectar ao PI SERVER")
    } else {
      return res.status(400).send(`Erro: ${err.response.data.Errors}`)
    }
  })

  function _getAttributesValue(_startDateTime, _endDateTime, _interval, _items) {
    try{
      let dataFormatted = SearchAttributesService.formatData(_startDateTime, _endDateTime, _interval)
      let atributtesFiltered = SearchAttributesService.filterAttributes(req.body.attributes, typeOfSearch.enumAttributes, _items)
      _iteracao(atributtesFiltered, dataFormatted)
    } catch(err){
      return res.status(400).send(err.message)
    }
    
  }

  function _iteracao(_attributes, _formatacao) {
    SearchAttributesService.iteracaoAtributtes(_attributes, _formatacao).then(resp => {
      return res.json(resp)
    }).catch(err => {
      return res.status(400).send(`Erro ao buscar atributos: ${err}`)
    })
  }
}

const searchAttributesWebids = (req, res) => {
  try{
    var typeOfSearch = SearchAttributesService.verifyTypeOfSearch(req.body.isSubattribute)
  } catch(err){
    return res.status(400).send(err.message)

  }
  requests.searchAttributes(req.body.webid, typeOfSearch.path)
    .then(response => {
      try{
        let atributtesFiltered = SearchAttributesService.filterAttributes(req.body.attributes, typeOfSearch.enumAttributes, response.data.Items)
        return res.json(atributtesFiltered)
      } catch(err){
        res.status(400).send(err.message)
      }
    })
    .catch(err => {
      if (err.response == undefined) {
        return res.status(400).send("Não foi possível conectar ao PI SERVER")
      } else {
        return res.status(400).send(`Erro: ${err.response.data.Errors}`)
      }
    })
}

module.exports = {
  searchAttributesValues,
  searchAttributesWebids
}
