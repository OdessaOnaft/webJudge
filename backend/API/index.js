module.exports = function(_, conf, database){
    return {
        api: require('./api.js')(_, conf, database),
        validators: require('./validators.js')(_),
        restoreSession: database.guest.restoreSession
    }
}