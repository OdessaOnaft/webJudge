module.exports = function(_, conf, database, executeAPI, fs){
    return {
        api: require('./api.js')(_, conf, database, executeAPI, fs),
        validators: require('./validators.js')(_),
        restoreSession: database.guest.restoreSession
    }
}