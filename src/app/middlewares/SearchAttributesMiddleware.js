const moment = require('moment')

const messagesPattern = {
    webid: 'Especifique qual WebId quer buscar',
    attributes: 'Especifique quais elementos deseja buscar',
    isSubattribute: 'Especifique se a busca é por atributo ou subatributo',
    startDateTime: 'Especifique o startDateTime',
    endDateTime: 'Especifique o endDateTime',
    interval: 'Especifique o interval'
}

const bodyPatternValues = [
    "webid",
    "attributes",
    "isSubattribute",
    "startDateTime",
    "endDateTime",
    "interval"
]

const bodyPatternWebIds = [
    "webid",
    "attributes",
    "isSubattribute"
]

//Validates the JSON of request
const validateJson = async(req, res, next) => {

    const bodyPattern = req.path == '/values'? bodyPatternValues : bodyPatternWebIds
    try{
        await validateSecretKey(req.body, bodyPattern)
    }catch(err){
        return res.status(401).send(err.message)
    }

    let promises = []
     Object.entries(bodyPattern).forEach(([key, val]) => {
        let promise = isPresent(val, req.body)
        promises.push(promise)
    })
    await Promise.all(promises).then(function(){
        return next()
    }).catch(err => {
        return res.status(400).send(err)
    })
}

//Check the number of params of request
const validateSecretKey = async(data, boddyPattern) => {
    var count = Object.keys(data).length
    if(count != boddyPattern.length){
        throw new Error(`Devem ser passados ${boddyPattern.length} parâmetros. Cheque especificação da requisição`)
    }
    
}

//Resolve a chaining promise searching for one attribute requested that doens't exist on PI
const isPresent = (bodyItem, bodyFromRequisiton) => {
    return new Promise(function(resolve, reject) {

        if(!(Object.keys(bodyFromRequisiton)).includes(bodyItem)){
            reject(messagesPattern[bodyItem])
        }
        resolve(true)
    })
}

//Validaiton for the dates and interval
const validateDatesAndInterval = (req, res, next) => {
    const startDateTime = req.body.startDateTime || ''
    const endDateTime = req.body.endDateTime || ''
    const interval = req.body.interval || ''
    try{
        validateDateTimeFormat(startDateTime, "startDateTime")
        validateDateTimeFormat(endDateTime, "endDateTime")
        validateHourFormat(interval, "interval")
        validatePeriods(startDateTime, endDateTime, interval)
    }catch(err){
        return res.status(400).send(err.message)
    }

    return next()
}

//Validation of Time pattern
const validateDateTimeFormat = (date, message = "dateTime") => {
    const validationDate = moment(date, "YYYY-MM-DD HH:mm:ss", true).isValid()
    if (!validationDate){
        throw new Error(`${message} está no formato errado, use YYYY-MM-DD HH:mm:ss`)
    }
}

//Validation of dates pattern
const validateHourFormat = (hour, message = "hour") => {
    const validationHour = moment(hour, "HH:mm:ss", true).isValid()
    if(!validationHour){
        throw new Error(`${message} está no formato errado, use HH:mm:ss`)
    }
}

//Validates if the dates have a valid period in the respective sampling interval 
const validatePeriods = (startDateTime, endDateTime, interval) => {
    const biggerDate = moment(startDateTime).isSameOrAfter(moment(endDateTime))
    if(biggerDate){
        throw new Error("startDateTime deve ser menor do que endDateTime")
    } else{
        const startDateMoment = moment(startDateTime, "YYYY-MM-DD HH:mm:ss")
        const endDateMoment = moment(endDateTime, "YYYY-MM-DD HH:mm:ss")
        const intervalMoment = moment(interval, "HH:mm:ss")
        startDateMoment.add(intervalMoment.seconds(), 'seconds')
        startDateMoment.add(intervalMoment.minutes(), 'minutes')
        startDateMoment.add(intervalMoment.hours(), 'hours')

        if(startDateMoment.isSameOrAfter(endDateMoment)){
            throw new Error("A duração do intervalo de amostragem é maior que o intervalo a ser buscado")
        }
    }
}

module.exports = {
    validateJson,
    validateSecretKey,
    isPresent,
    validateDatesAndInterval,
    validateDateTimeFormat,
    validateHourFormat,
    validatePeriods
}