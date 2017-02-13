module.exports = function(_, async, systemDB, executeApi){
    var solQueue = async.queue(function(data, callback) {
        executeApi.solveProblem({
            solutionId: data.solutionId
        }, (err, data)=>{
            callback();
        });
    }, 4);

    setInterval(()=>{
        systemDB.getSolutionsQueue({skip: solQueue.length()}, (err, data)=>{
            if (!err){
                _.each(data, (v)=>{
                    solQueue.push(v);
                });
            }
        })
    }, 1000);

    return {
        getQueueLength: (data, cb)=>{
            cb(null, {
                length: solQueue.length()
            });
        }
    }
};