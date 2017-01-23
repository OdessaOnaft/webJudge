module.exports = function(_, pg, connStr, humps){
    return function(sql, args){
        return new Promise((resolve, reject)=>{
            pg.connect(connStr, function (err, client, done) {
                try {
                    client.query(sql, args, function (err, result) {
                        if (err)
                            throw err;
                        done();
                        resolve(humps.camelizeKeys(result.rows));
                    });
                }
                catch (e) {
                    done();
                    reject(e);
                }
            });
        })
    }
};