var mail = require("./mail.js");
var mysql = require("mysql");

// establish database connection 
var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_UDEMY_PRICES
});

connection.connect();

exports.processCourses = function(body) {
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
                        mail.notifySubscribers(course.title, row.price, newPrice);

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
};
