module.exports = function(_, conf, Database, executeAPI){
    function ok(callback){
        return function(err, data){
            if(err){
                callback(err, null);
            } else {
                callback(null, data);
            }
        }
    }

    return {
        addProblem: (session, data, callback)=>{
            data.userId = session.userId;
            if (data.outputType != 'file') {
                executeAPI.generateOutFilesForProblem({
                    lang: data.lang || 'cpp',
                    tasks: data.samples,
                    source: data.outputSource
                }, (err, data2)=> {
                    console.log(err, data);
                    data.samples = data2;
                    Database.addProblem(data, ok(callback));
                })
            } else {
                Database.addProblem(data, ok(callback));
            }
        },
        editProblem: (session, data, callback)=>{
            data.userId = session.userId;
            if (data.outputType != 'file') {
                executeAPI.generateOutFilesForProblem({
                    lang: data.lang,
                    tasks: data.samples,
                    source: data.outputSource
                }, (err, data2)=> {
                    data.samples = data2;
                    Database.editProblem(data, ok(callback));
                })
            } else {
                Database.editProblem(data, ok(callback));
            }
        }
    }
};