const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UsersSchema = new Schema({
    _id : {
        type : Number
    },

    first_name : {
        type : String
    },

    last_name : {
        type : String
    },
    birthday : {
        type : Date
    }

});

UsersSchema.statics.insertOne = function(user) {
    return new Promise((resolve, reject) => {
        const newUser = new Users(user);
        newUser.save((error, user) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
};

const Users = mongoose.model('users', UsersSchema);

module.exports = Users;