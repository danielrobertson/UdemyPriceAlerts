var mail = require("./mail.js");
var database = require("./dataaccess"); 

/** 
 * Compares each course 
 */ 
exports.processCourses = function(body) {
    database.getAllPriceData(function(err, rows, fields) {
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
                        database.updateCourse(course.title, newPrice); 
                    }
                }

            });

            if (isNewCourse) {
                database.insertCourse(course); 
            }
        });

    });
};
