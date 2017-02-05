module.exports = function(_, conf, database, executeAPI){
    function ok(callback){
        return function(err, data){
            if(err){
                callback(err);
            } else {
                callback(null);
            }
        }
    }
    
    var guest = require('./scope/guest.js')(_, conf, database.guest);
    var student = require('./scope/student.js')(_, conf, database.student);
    var teacher = require('./scope/teacher.js')(_, conf, database.teacher, executeAPI);
    var admin = require('./scope/admin.js')(_, conf, database.admin);

    student = _.extend(_.clone(guest), student);
    teacher = _.extend(_.clone(student), teacher);
    admin = _.extend(_.clone(teacher), admin);
    
    var api = {
        guest: guest,
        student: student,
        teacher: teacher,
        admin: admin
    };

    return api;
};
