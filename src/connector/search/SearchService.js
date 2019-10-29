const Q = require('q')
const requests = require('../RequestsPiServer')
const moment = require('moment')

const formatData = function(startDateTime, endDateTime, interval){
    return new Promise(function(resolve, reject) {
        const [startDateFormatted, startTimeFormatted] = startDateTime.split(' ').map(encodeURIComponent)
        const [endDateFormatted, endTimeFormatted] = endDateTime.split(' ').map(encodeURIComponent)
        const intervalFormatted = encodeURIComponent(interval)

        resolve({startDateFormatted, startTimeFormatted, endDateFormatted, endTimeFormatted, intervalFormatted})
    })
}
  
const filterElements = (elementsRequired, enumElements, existingElements) => {
    var rejectionElements = "Elemento(s) "
    return new Promise(function(resolve, reject) {
        if(!elementsRequired.length){
            reject("Especifique quais elementos deseja buscar")
        }
        nonexistingElements = elementsRequired.filter(elementRequired => !enumElements.includes(elementRequired))
        if(nonexistingElements.length){
            nonexistingElements.forEach(function(element){
                rejectionElements = `${rejectionElements} ${element} `;
            })
            reject(`${rejectionElements} não existem no PI SERVER`)
        }
        elementsToSearch = existingElements.filter(existingElement => elementsRequired.includes(existingElement.Name))
        var _listaAgrupada = [];
        var _listaOdernada = [];
        elementsRequired.map(function (_item, i) {
            _listaAgrupada.push([]);
        });

        //iterações para ordenar as requisições de acordo com o array de elementos a serem buscados
        elementsToSearch.map(function (_item, i) {
            var _arrayPos = elementsRequired.indexOf(_item.Name);

            if (_arrayPos >= 0)
                _listaAgrupada[_arrayPos].push(_item);

        });

        _listaAgrupada.map(function (_item, i) {
            _listaOdernada.push.apply(_listaOdernada, _item)
        })
        resolve(_listaOdernada);
    })
}

const iteracaoAtributtes = function(attributes, formatacao){
    var promises = [];
    return new Promise(function(resolve, reject) {
        attributes.forEach(function (element){
            var promise = requests.searchDataAttributes(element.WebId, formatacao).then(function(response){
                return response.data.Items
            })
            promises.push(promise);
        })
        Q.all(promises).then(function(data){
            resolve(data)
        }).catch();
    })
}

//Validação para os dados que foram enviados
const validation = function(data){
    return new Promise(function(resolve, reject) {
    
        const validationDateStart = moment(data.startDateTime, "YYYY-MM-DD HH:mm:ss", true).isValid()
        if (!validationDateStart){
            reject("startDateTime está no formato errado, use YYYY-MM-DD HH:mm:ss")
        }
        const validationDateEnd = moment(data.endDateTime, "YYYY-MM-DD HH:mm:ss", true).isValid()
        if(!validationDateEnd){
            reject("endDateTime está no formato errado, use YYYY-MM-DD HH:mm:ss")
        }
        const validationInterval = moment(data.interval, "HH:mm:ss", true).isValid()
        if(!validationInterval){
            reject("interval está no formato errado, use HH:mm:ss")
        }
        if(validationDateStart && validationDateEnd){
            const biggerDate = moment(data.startDateTime).isSameOrAfter(moment(data.endDateTime))
            if(biggerDate){
                reject("startDateTime deve ser menor do que endDateTime")
            }
        }
        
        resolve(true)
    })
}


module.exports = {
    formatData,
    filterElements,
    iteracaoAtributtes,
    validation
}