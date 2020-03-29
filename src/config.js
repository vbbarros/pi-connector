require('dotenv').config();

module.exports = {
    url: process.env.PI_URL,
    user:  process.env.PI_USER,
    pass:  process.env.PI_PASSWORD,
    attributes:  process.env.PI_ATTRIBUTES.split(","),
    subattributes:  process.env.PI_SUB_ATTRIBUTES.split(",")
}