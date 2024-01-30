const Auth  = require('./auth');
const Projects = require('./projects')
const Tasks = require('./tasks');
const Database = require('./database')
const Fields = require('./fields')
const Api = require('./api')
const UI = require('./ui')
const Versions = require('./versions')

const Activation = require('./activation')

const Log = require('./Logs')
const Notify = require('./notify')

const PreImport = require('./preimport')

const socketController = require('./socket')

module.exports = {
    Auth,
    Projects,
    Tasks,
    Database,
    Fields,
    Api,
    UI,
    Versions,
    Activation,
    Log,
    Notify,
    PreImport,
    socketController
}
