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
            	var newPrice = Number(course.price.replace("$", "")); 
                var isNewCourse = true;
                rows.forEach(function(row) {
                    if (row.title === course.title) {
                        console.log("Processing course price check: " + course.title + ", $" + row.price + " -> $" + newPrice);
                        isNewCourse = false;

                        if (newPrice < row.price) {
                            console.log("\tPrice has dropped for course: " + course.title + ", $" + row.price + " -> $" + newPrice);

                            // send alert to user about this price drop 

                            // update database with current price so that check can repeat tomorrow 
                        }
                    }

                });

                if (isNewCourse) {
                    // add course to datastore 
                    console.log("Adding new course: " + course.title + " " + course.price);

                    var newCourseData = {
                        title: course.title,
                        price: course.price.replace("$", "")
                    }

                    connection.query("insert into price set ?", newCourseData, function(err, result) {
                        if (err) {
                            throw err;
                        }
                    });

                }

            });



        });

    } else {
        console.log("Error request course info from Udemy");
    }
});
