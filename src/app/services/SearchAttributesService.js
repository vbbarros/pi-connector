const Q = require('q')
const requests = require('../utils/RequestsPiServer')
const config = require('../../config')

const formatData = (startDateTime, endDateTime, interval) => {
    const [startDateFormatted, startTimeFormatted] = startDateTime.split(' ').map(encodeURIComponent)
    const [endDateFormatted, endTimeFormatted] = endDateTime.split(' ').map(encodeURIComponent)
    const intervalFormatted = encodeURIComponent(interval)
    return {startDateFormatted, startTimeFormatted, endDateFormatted, endTimeFormatted, intervalFormatted}
}
  
const filterAttributes = (attributesRequired, enumAttributes, existingAttributes) => {
    let rejectionAttributes = "Atributo(s) "
    if(!attributesRequired.length){
        throw new Error("Especifique quais atributos deseja buscar")
    }
    nonexistingAttributes = attributesRequired.filter(attributeRequired => !enumAttributes.includes(attributeRequired))
    if(nonexistingAttributes.length){
        nonexistingAttributes.forEach(function(attribute){
            rejectionAttributes = `${rejectionAttributes} ${attribute} `;
        })
        throw new Error(`${rejectionAttributes} não existem no PI SERVER`)
    }
    attributesToSearch = existingAttributes.filter(existingAttribute => attributesRequired.includes(existingAttribute.Name))
    let _listaAgrupada = [];
    let _listaOdernada = [];
    attributesRequired.map(function (_item, i) {
        _listaAgrupada.push([]);
    });

    //iterações para ordenar as requisições de acordo com o array de attributos a serem buscados
    attributesToSearch.map(function (_item, i) {
        let _arrayPos = attributesRequired.indexOf(_item.Name);

        if (_arrayPos >= 0)
            _listaAgrupada[_arrayPos].push(_item);

    });

    _listaAgrupada.map(function (_item, i) {
        _listaOdernada.push.apply(_listaOdernada, _item)
    })
        
    return _listaOdernada;
}

const iteracaoAtributtes = (attributes, formatacao) => {
    let promises = []
    return new Promise(function(resolve, reject) {
        attributes.forEach(function (attribute){
            let promise = requests.searchDataAttributes(attribute.WebId, formatacao).then(function(response){
                return response.data.Items
            })
            promises.push(promise);
        })
        Q.all(promises).then(function(data){
            resolve(data)
        }).catch(err =>{
            if(err.response.status == 502){
                return reject(`${err.response.data.Errors}`)
            } else {
                return reject(`${err.message}`)
            }
            
        });
    })
}

const verifyTypeOfSearch = (isSubattribute) => {

    if(isSubattribute.toLowerCase() != "true" && isSubattribute.toLowerCase() != "false"){
        throw new Error("Especifique se a busca é por atributo ou subatributo")
    }
    let enumAttributes = isSubattribute == "true" ? config.subattributes : config.attributes
    let path = isSubattribute == "true" ? 'attributes' : 'elements'
    return {enumAttributes, path}
    
}

module.exports = {
    formatData,
    filterAttributes,
    iteracaoAtributtes,
    verifyTypeOfSearch
}