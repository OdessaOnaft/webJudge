﻿﻿module.exports = function (_){
    return function (err) {
        var errors = {
            'Invalid token': 1,
            'User with this email already exists': 2,
            'Incorrect login or/and password': 3,
            'Wrong answer': 4,
            'Timeout': 5,
            'Access denied': 6
        };
        if (_.isUndefined(errors[err.message])){
            return {
                message: err.message,
                code: -1
            }
        } else {
            return {
                message: err.message,
                code: errors[err.message]
            }
        }
    };
};