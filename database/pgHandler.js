module.exports = function(_, pg, connStr, humps){
    return function(sql, args){
        return new Promise((resolve, reject)=>{
            pg.connect(connStr, function (err, client, done) {
                try {
                    client.query(sql, args, function (err, result) {
                        done();
                        if (err){
                            reject(err);
                        } else {
                            resolve(humps.camelizeKeys(result.rows));
                        }
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