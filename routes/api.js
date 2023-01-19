const { json } = require('express');
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


router.get('/report/:year/:month/:user_id', (req, res) => {
    // Extract the parameters from the request object
    const { year, month, user_id } = req.params;
    console.log(`${year}, ${month}, ${user_id}`);
  
    // Use Mongoose to query the database for the specific month and year and user_id
    Costs.find({ year, month, user_id }, (err, costs) => {
      if (err) {
        // Handle the error
        res.status(500).send(err);
      } else {
        // Create an object to store the costs by category
        const report = {};
  
        // Iterate over the costs and group them by category
        costs.forEach((cost) => {
          if (!report[cost.category]) {
            report[cost.category] = [];
          }
          report[cost.category].push(cost);
        });
  
        // Send the report as a JSON response
        res.json(report);
      }
    });
  });
router.get('/addcost', (req, res) => {
    console.log("GET method for /addcost");
    res.render('addcost');
});

router.post('/addcost', (req, res, next) =>{
    
    console.log("POST method for /addcost");
    const { year, month, day, description, category, sum} = req.body;
    
    if ( !year || !month || !day || !description || !category || !sum){
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