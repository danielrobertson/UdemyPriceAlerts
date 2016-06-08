var request = require("request");
var mysql = require("mysql");

// establish database connection 
var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_UDEMY_PRICES
});

connection.connect();

// get course information from Udemy 
var clientId = process.env.UDEMY_CLIENT_ID;
var clientSecret = process.env.UDEMY_CLIENT_SECRET;

var options = {
    url: "https://www.udemy.com/api-2.0/courses/",
    auth: {
        user: clientId,
        password: clientSecret
    }
};

request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        connection.query("select * from price", function(err, rows, fields) {
            if (err) {
                throw err;
            }

            var courseList = JSON.parse(body).results;
            courseList.forEach(function(course) {
                var isNewCourse = true;
                rows.forEach(function(row) {

                    if (row.title === course.title) {
                    	console.log("Not new course\n" + course.title); 
                        console.log("Processing course: " + course.title + ", price: " + course.price);
                        isNewCourse = false;

                        if (course.price < row.price) {
                            console.log("\tPrice has dropped for course: " + course.title + " from " + row.price + " to " + course.price);

                            // send alert to user about this price drop 

                            // update database with current price so that check can repeat tomorrow 
                        }
                    }

                });

                if (isNewCourse) {
                    // add course to datastore 
                    console.log("New course found:");
                    console.log(course); 
                }

            });



        });

        connection.end();

    } else {
        console.log("Error request course info from Udemy");
    }
});