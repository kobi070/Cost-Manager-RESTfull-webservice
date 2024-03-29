// Kobi Kuzi xxxxxxxx
// Dan Kvitca xxxxxxxx
// api.js

const express = require('express');
const router = express.Router();
const Costs = require('../models/costs');
const Users = require('../models/users');
const winston = require('winston');

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Function to insert a dummy user into the Users collection
async function insertUser() {
  try {
      // Define the dummy user object
      const dummyUser = {
        id : 123123,
        first_name: 'moshe',
        last_name: 'israeli',
        birthday: new Date(Date.parse("January, 10, 1990")).toLocaleDateString("en-us", {
          month: "long",
          day: "numeric",
          year: "numeric"
        }).toString(),
      };
      // Try to insert the dummy user into the Users collection
      const insertedUser = await Users.insertOne(dummyUser);
      winstonLogger.info("Inserted a new user into the Users collection.");
      winstonLogger.info(`A user with the following details has been created: ${insertedUser}`); 
  } catch (error) {
    winstonLogger.error(`An error occurred while trying to insert a new user: ${error}`);
  }
}

// Call the insertUser function
insertUser();

// POST method to add cost using URL parameters (user_id, year, month, day, description, category, sum)
router.post('/addcost/', (req, res, next) =>{

  
    // Log that a POST request has been received for the /addcost endpoint
    winstonLogger.info("Received a POST request for /addcost endpoint.");
    
    // Destructure the parameters from the request
    const {user_id, year, month, day, description, category, sum} = req.query;
  
    // Check if any required parameters are missing
    if (!user_id || !year || !month || !day || !description || !category || !sum){
        return res.status(400).json({ error : 'Missing required parms'});
    }
    
    // Check if the category is valid
    if (Costs.schema.path('category').enumValues.indexOf(category) === -1) {
        return res.status(400).json({ error: "Invalid category" });
    }
    
    // Define the newCosts object
    const newCosts = {
        user_id,
        year,
        month,
        day,
        description,
        category,
        sum
    }

    var costsExists = async (newCosts) => {
      const result = await Costs.findOne(newCosts);
      // console.log(result);
      if (result){
        return true;
      }
      else{
        return false;
      }
    };

    const isExist = Costs.exists(newCosts).then((isExist) => true);
    console.log(isExist);

    // Try to insert the newCosts object into the Costs collection
    Costs.insertOne(newCosts).then( (newCosts) => {      
      // Log that a new cost document has been created
      winstonLogger.info(`A new cost document has been created: ${newCosts}`);
      // Send the new cost object back to the client
      res.send(`A new cost with the following details has been created: ${newCosts}`);
    }).catch(error => {      
    // log an error if it occurred while trying to insert a new cost
    winstonLogger.error(`An error occurred while trying to insert a new cost: ${error}`);
    // pass the error to the next middleware
    next(error);
    });
});

// Get report for specific user by year and month
router.get('/report/', (req, res) => {
  // Destructure user_id, year, and month from the request parameters
  const {user_id, year, month} = req.query;

  // Log the request parameters for debugging purposes
  winstonLogger.info(req.query);

  // Initialize an object to store the results
  const result = {};

  // Find costs that match the user_id, year, and month
  Costs.find({user_id, year, month}, (err, costs) => {
    // If there is an error, log the error message
    if(err) winstonLogger.error(`this is err : ${err}`);
    else{
      // Define an array of categories
      const categories = Costs.schema.path('category').enumValues;
      
      // Get a list of cost properties
      const objectIndex = Object.keys(Costs.schema.paths);
      var index = objectIndex.slice(0, objectIndex.length - 2);

      // Initialize an empty array for each category
      categories.forEach(c => {
        result[c] = [];
      });

      // Iterate over the costs
      Object.entries(costs).forEach(([key, value]) => {
        // Get the cost's category
        let category = value.category;

        // If the category is one of the predefined categories
        if (categories.includes(category)){
          // Initialize an object to store the cost details
          let costDetails = {};

          // Iterate over the cost's properties
          for (let val in value){
            // If the property is one of the defined cost properties
            if (index.includes(val))
            {
              // If the property is not the category
              if (val != "category")
              {
                // Add the property to the cost details object
                costDetails[val] = value[val];
              }
            }
          }
          // Push the cost details to the result array for the category
          result[category].push(costDetails);
        }
      });
      // Log the result for debugging purposes
      winstonLogger.info(result);
    }
    // Send the result as a JSON response
    res.json(result);
  });
});


module.exports = router;