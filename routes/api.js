const express = require('express');
const router = express.Router();
const Costs = require('../models/costs');
const Users = require('../models/users');


async function insertUser() {
  try {
    const dummyUser = {
      _id : 123123,
      first_name: 'moshe',
      last_name: 'israeli',
      birthday: new Date(Date.parse("January, 10, 1990")).toLocaleDateString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }).toString(),
    };

    const insertedUser = await Users.insertOne(dummyUser);
    console.log("insertOne method for UsersSchema");
    console.log(`A user ${insertedUser} has been created`);
  } catch (error) {
    console.log(error);
  }
}
insertUser();


//POST method for adding cost using url parms at => addcost/:user_id/:year/:month/:day/:description/:category/:sum
router.post('/addcost/:user_id/:year/:month/:day/:description/:category/:sum', (req, res, next) =>{
    
    console.log("POST method for /addcost");
    const { year, month, day, description, category, sum} = req.params;
    var user_id = 123123;

    if ( !year || !month || !day || !description || !category || !sum){
        return res.status(400).json({ error : 'Missing required parms'});
    }
    console.log(category);
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

router.get('/report/:user_id/:year/:month', (req, res) => {
  const {user_id, year, month} = req.params;
  // console.log(req.params);

  const result = {};
  
  Costs.find({user_id, year, month}, (err, costs) => {
    if(err) console.log(`this is err : ${err}`);
    else{
        const categories = ["food", "health", "housing", "sport", "education", "transportation", "other"];
        const index = Costs.prototype.getPropertiesList();

        // const result = {};

        categories.forEach(c => {
          result[c] = [];
        });

        Object.entries(costs).forEach(([key, value]) => {
          
          let category = value.category;
          
          if (categories.includes(category)){
            let costDetails = {};

            for (let val in value){
              if (index.includes(val))
              {
                if (val != "category")
                {
                  costDetails[val] = value[val];
                }
              }
            }
            result[category].push(costDetails);
          }
        });
        console.log(result);
      }
      res.json(result);
      
    });
});


module.exports = router;