const axios = require('axios')
const config = require('../../config')
const https = require('https')

axios.defaults.baseURL = config.url
//axios.defaults.timeout = 25000
axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })

axios.defaults.auth = {
  username: config.user,
  password: config.pass
}

//Infromation of Attributes
const searchAttributes = function(webid, path){
  return axios.get(`/${path}/${webid}/attributes?selectedFields=Items.WebId;Items.Name`)
} 

//Historial data of Attributes
const searchDataAttributes = function(webid, formatacao){
  return axios.get(`/streams/${webid}/interpolated?endTime=${formatacao.endDateFormatted}%20${formatacao.endTimeFormatted}&includeFilteredValues=false&interval=${formatacao.intervalFormatted}&startTime=${formatacao.startDateFormatted}%20${formatacao.startTimeFormatted}&timezone=GMT Standard Time&selectedFields=Items.Value;Items.Timestamp`)
}

module.exports = {
  searchAttributes,
  searchDataAttributes
}