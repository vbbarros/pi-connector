const requests = require('../RequestsPiServer')
const config = require('../../config')
const searchService = require('./SearchService')


const searchData = (req, res) => {

  const webid = req.body.webid || '';
  if(webid == ''){
    return res.status(400).send("Especifique qual WebId quer buscar")
  }
  const startDateTime = req.body.startDateTime || ''
  const endDateTime = req.body.endDateTime || ''
  const interval = req.body.interval || ''
  const elementsRequired = req.body.elements || ''
  var formatacao = ''
  var elements = ''

  searchService.validation({ startDateTime, endDateTime, interval, elementsRequired })
    .then(function (response) {
      return _searchAttributes(webid);

    }).catch(err => {
      res.status(400).send(`Erro na na validação: ${err}`)
    })

  //Functions
  function _searchAttributes(_webid) {
    requests.searchAttributes(_webid)
      .then(response => {
        _formatData(startDateTime, endDateTime, interval, response.data.Items);
      })
      .catch(err => {
        if (err.response == undefined) {
          res.status(400).send("Não foi possível conectar ao PI SERVER")
        } else {
          res.status(400).send(`Error: ${err.response.data.Errors}`)
        }
        //res.send(401).json(`messagem`)
      })
  }

  function _formatData(_startDateTime, _endDateTime, _interval, _items) {
    searchService.formatData(_startDateTime, _endDateTime, _interval)
      .then(resp => {
        formatacao = resp
        _filterElements(elementsRequired, config.elements, _items, formatacao);

      }).catch(err => {
        res.status(400).send(`Erro ao formatar dados: ${err.message}`)
      })
  }

  function _filterElements(_elementsRequired, _elements, _items, _formatacao) {
    searchService.filterElements(_elementsRequired, _elements, _items)
      .then(function (resp) {
        elements = resp
        _iteracao(elements, _formatacao)
      }).catch(err => {
        res.status(400).send(`Erro ao filtrar elementos: ${err}`)
      })
  }

  function _iteracao(_elements, _formatacao) {
    searchService.iteracaoAtributtes(_elements, _formatacao)
      .then(resp => {
        res.json(resp)
      }).catch(err => {
        res.status(400).send(`Erro ao buscar elementos: ${err.message}`)
      })
  }

}

module.exports = {
  searchData
}
