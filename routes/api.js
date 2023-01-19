const express = require('express');
const router = express.Router();
const Costs = require('../models/costs');
const Users = require('../models/users');

// Dummy user we were asked to create
dummyUser = {
    _id : 123123,
    first_name: 'moshe',
    last_name: 'israeli',
    birthday: Date("January, 10th, 1990"),
}

// Insirtion of the dummy
Users.insertOne(dummyUser).then( (dummyUser) => {
    console.log("insertOne method for UsersSchema");
    
    console.log(`A user ${dummyUser._id} has been created`);
}).catch((error) => {
    console.log(error);
});

router.get('/report', (req, res) => {
    console.log("GET method for /report");
    const {user_id, year, month} = req.query;

    if (!user_id || year || !month){
        return res.status(400).json({error: 'Missing requied parmeters'});
    }

    Costs.aggregate([
        {
            $match: {
                user_id: parseInt(user_id),
                year: parseInt(year),
                month: month
            }
        },
        {
            $group: {
                _id: '$category',
                costs: {$push: '$$ROOT'}
            }
        }
    ]).toArray((err, result) => {
        if(err){
            return res.status(500).json({error: "Failed to fetch report"});
        }

        const report = {
            food : [],
            helth : [],
            housing: [],
            sport: [],
            education: [],
            transportation: [],
            other : []
        };
        result.forEach(item => {
            report[item._id] = item.costs;
        });

        res.json(report);

    });
});

router.get('/addcost', (req, res) => {
    console.log("GET method for /addcost");
    res.render('addcost');
});

router.post('/addcost', (req, res, next) =>{
    
    console.log("POST method for /addcost");
    const { user_id, year, month, day, description, category, sum} = req.body;
    
    if (!user_id || !year || !month || !day || !description || !category || !sum){
        return res.status(400).json({ error : 'Missing required parms'});
    }
    
    if (["food", "health", "housing", "sport", "education", "transportation", "other"].indexOf(category) === -1) {
        return res.status(400).json({ error: "Invalid category" });
    }
    
    const newCosts = {
        user_id,
        year,
        month,
        day,
        description,
        category,
        sum
    }

    Costs.insertOne(newCosts).then( (newCosts) => {
        res.send(`new cost: ${newCosts} has been created`);
    }).catch(next);
});

router.get('/about', (req, res) => {
    console.log("GET method for /about");
    const devs = [
        {first_name: 'Kobi', last_name: 'Kuzi', id: 316063908, email: 'Kobi070@gmail.com'},
        {first_name: 'Dan', last_name: 'Kvitca', id: 205570674, email: 'Dkvitca@gmail.com'}
    ]
    res.json(devs);
});

module.exports = router;