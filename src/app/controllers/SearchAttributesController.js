const requests = require('../utils/RequestsPiServer')
const SearchAttributesService = require('../services/SearchAttributesService')

const searchAttributesValues = async(req, res) => {
  
  const _getAttributesValue = async(_startDateTime, _endDateTime, _interval, _items) => {
    try{
      const dataFormatted = SearchAttributesService.formatData(_startDateTime, _endDateTime, _interval)
      const atributtesFiltered = SearchAttributesService.filterAttributes(req.body.attributes, typeOfSearch.enumAttributes, _items)
      return await _iteracao(atributtesFiltered, dataFormatted)
    } catch(err){
      return res.status(400).send(err.message)
    }
    
  }

  const _iteracao = async(_attributes, _formatacao) => {
    try{
      const resp = await SearchAttributesService.iteracaoAtributtes(_attributes, _formatacao)
      return resp
    }catch(err){
      return res.status(400).send(`Erro ao buscar atributos: ${err}`)
    }
  }
  
  try{
    var typeOfSearch = SearchAttributesService.verifyTypeOfSearch(req.body.isSubattribute)
  } catch(err){
    return res.status(400).send(err.message)
  }

  try{
    const attr = await requests.searchAttributes(req.body.webid, typeOfSearch.path)
    const resp = await _getAttributesValue(req.body.startDateTime, req.body.endDateTime, req.body.interval, attr.data.Items)
    return res.json(resp)
  }catch(err){
    if (err.response == undefined) {
      return res.status(400).send("Não foi possível conectar ao PI SERVER")
    } else {
      return res.status(400).send(`Erro: ${err.response.data.Errors}`)
    }
  }

}

const searchAttributesWebids = async(req, res) => {
  try{
    var typeOfSearch = SearchAttributesService.verifyTypeOfSearch(req.body.isSubattribute)
  } catch(err){
    return res.status(400).send(err.message)
  }

  let attr
  try{
    attr = await requests.searchAttributes(req.body.webid, typeOfSearch.path)
  }catch(err){
    res.status(400).send(err.message)
  }

  try{
    const atributtesFiltered = SearchAttributesService.filterAttributes(req.body.attributes, typeOfSearch.enumAttributes, attr.data.Items)
    return res.json(atributtesFiltered)
  }catch(err){
    if (err.response == undefined) {
      return res.status(400).send("Não foi possível conectar ao PI SERVER")
    } else {
      return res.status(400).send(`Erro: ${err.response.data.Errors}`)
    }
  }
}

module.exports = {
  searchAttributesValues,
  searchAttributesWebids
}
