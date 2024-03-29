// Kobi Kuzi xxxxxxxx
// Dan Kvitca xxxxxxxx,
// costs.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CostsSchema = new Schema({
    
    user_id : {
        type: Number 
    },

    year : {
         type : Number
        },
    
    month : {
         type : String
        },
    
    day : {
         type : Number
        },
    
    description : {
         type : String
        },
    
    category : {
         type : String,
         enum: ["food", "health", "housing", "sport", "education", "transportation", "other"]
        },
    
    sum:{
        type: Number
    }
});

CostsSchema.statics.insertOne = function(costs) {
    return new Promise((resolve, reject) => {
        const newCosts = new Costs(costs);
        newCosts.save((error, user) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
};

CostsSchema.statics.exists = function(query) {
    return this.findOne(query).then(doc => {
      return !!doc;
    });
  };

const Costs = mongoose.model('costs', CostsSchema);

module.exports = Costs;