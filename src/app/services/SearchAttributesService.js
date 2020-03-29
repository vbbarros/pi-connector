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
    if(!attributesRequired.length){
        throw new Error("Especifique quais atributos deseja buscar")
    }
    nonexistingAttributes = attributesRequired.filter(attributeRequired => !enumAttributes.includes(attributeRequired))
    if(nonexistingAttributes.length){
        let rejectionAttributes = "Atributo(s) "
        nonexistingAttributes.forEach(function(attribute){
            rejectionAttributes = `${rejectionAttributes} ${attribute} `;
        })
        throw new Error(`${rejectionAttributes} não existem no PI SERVER`)
    }

    const attributesToSearch = existingAttributes.filter(existingAttribute => attributesRequired.includes(existingAttribute.Name))
    
    const attributesFiltered = attributesRequired.reduce((acc, value) => {
        const attr = attributesToSearch.filter(attr => attr.Name === value)
        acc.push(...attr)
        return acc
    }, [])

    return attributesFiltered
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
    const enumAttributes = isSubattribute == "true" ? config.subattributes : config.attributes
    const path = isSubattribute == "true" ? 'attributes' : 'elements'
    return {enumAttributes, path}
}

module.exports = {
    formatData,
    filterAttributes,
    iteracaoAtributtes,
    verifyTypeOfSearch
}