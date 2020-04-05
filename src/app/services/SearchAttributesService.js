const Q = require('q')
const requests = require('../utils/RequestsPiServer')
const config = require('../../config')

//Formats dates in the required pattern
const formatData = (startDateTime, endDateTime, interval) => {
    const [startDateFormatted, startTimeFormatted] = startDateTime.split(' ').map(encodeURIComponent)
    const [endDateFormatted, endTimeFormatted] = endDateTime.split(' ').map(encodeURIComponent)
    const intervalFormatted = encodeURIComponent(interval)
    return {startDateFormatted, startTimeFormatted, endDateFormatted, endTimeFormatted, intervalFormatted}
}
  
//Filter attributes to return in the same order as in the request
const filterAttributes = (attributesRequired, enumAttributes, existingAttributes) => {
    if(!attributesRequired.length){
        throw new Error("Especifique quais atributos deseja buscar")
    }
    const nonexistingAttributes = attributesRequired.filter(attributeRequired => !enumAttributes.includes(attributeRequired))
    if(nonexistingAttributes.length){
        let rejectionAttributes = "Atributo(s) "
        nonexistingAttributes.forEach((attribute) => {
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

//Resolve a chaining promise with the historical data of each attribute
const iteracaoAtributtes = (attributes, formatacao) => {
    let promises = []
    return new Promise((resolve, reject) => {
        attributes.forEach((attribute) => {
            let promise = requests.searchDataAttributes(attribute.WebId, formatacao).then(function(response){
                return response.data.Items
            })
            promises.push(promise);
        })
        Q.all(promises).then((data) => {
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

//returns the respective enumAttributes according to the isSubattribute param
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