module.exports = function(_, conf, database, executeAPI){
    return {
        api: require('./api.js')(_, conf, database, executeAPI),
        validators: require('./validators.js')(_),
        restoreSession: database.guest.restoreSession
    }
}