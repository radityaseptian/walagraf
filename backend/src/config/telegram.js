require('dotenv').config()

const { APIID, APIHASH } = process.env

module.exports = {
  fromUser: null,
  id: null,
  userId: null,
  apiHash: APIHASH,
  apiId: parseInt(APIID),
  clientParams: {
    useWSS: true,
    autoReconnect: true,
    connectionRetries: 5,
    deviceModel: 'PC',
    systemLanguage: 'en',
    appVersion: '4.10.0',
    deviceType: 'Desktop',
    maxConcurrentDownloads: 1,
    systemVersion: 'Windows 10',
  },
}
