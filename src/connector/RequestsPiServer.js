const axios = require('axios')
const config = require('../config')
const https = require('https')

// para debug
// axios.interceptors.request.use(request => {
//   console.log('Starting Request', request)
//   return request
// })

axios.defaults.baseURL = config.url
//axios.defaults.timeout = 25000
axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })

axios.defaults.auth = {
  username: config.user,
  password: config.pass
}

const searchAttributes = function(webid){
  return axios.get(`/elements/${webid}/attributes?selectedFields=Items.WebId;Items.Name`)
} 

const searchDataAttributes = function(webid, formatacao){
  return axios.get(`/streams/${webid}/interpolated?endTime=${formatacao.endDateFormatted}%20${formatacao.endTimeFormatted}&includeFilteredValues=false&interval=${formatacao.intervalFormatted}&startTime=${formatacao.startDateFormatted}%20${formatacao.startTimeFormatted}`)
} 
module.exports = {
  searchAttributes,
  searchDataAttributes
}