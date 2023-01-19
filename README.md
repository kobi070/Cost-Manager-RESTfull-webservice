# Cost-Manager-RESTfull-webservice
README
# Introduction
This project is a RESTful web service for managing daily costs. The service is built using a MongoDB database and Express.js, and allows users to add new cost items and retrieve detailed reports of their expenses.



# Database
The MongoDB database is organized into two collections: "users" and "costs". The "users" collection holds documents that include the following properties: id, first_name, last_name, and birthday. The "costs" collection holds documents that include the following properties: user_id, year, month, day, id, description, category, and sum.
The database is empty, except for a single document in the "users" collection, which includes the details of an imaginary user with the following data:

Copy code
id: 123123
first_name: moshe
last_name: israeli
birthday: January, 10th, 1990
The costs are organized according to categories: food, health, housing, sport, education, transportation, and other.

# Application
The application is built using Express.js and runs on the server side. It includes the following RESTful web services endpoints:

/addcost/ for adding a new cost item using the POST method. The parameters include: user_id, year, month, day, description, category, and sum. The category must be one of the available options.

/report/ for getting a detailed report (in JSON) of costs for a specific month and year, using the GET method. The parameters include: user_id, month, and year. The returned JSON document includes an object with properties for each category, whose values are arrays of objects describing cost items.

/about/ for getting a detailed report (in JSON) of the devs names and emails
