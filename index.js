var request = require("request");
var mysql = require("mysql");

// establish database connection 
var connection = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect();

// get course information from Udemy 
var udemyCoursesEndpoint = "https://www.udemy.com/api-2.0/courses/";
//request(udemyCoursesEndpoint, function (error, response, body) {
	//if (!error && response.statusCode == 200) {

		// mock data for Udemy courses until I get an API token 
		var body = {
		    "courses": [{
		        "title": "intro to jquery",
		        "is_paid": "true",
		        "price": "20"
		    }, {
		        "title": "mastering angular",
		        "is_paid": "false",
		        "price": "0"
		    }, {
		        "title": "Creating User Experiences",
		        "is_paid": "true",
		        "price": "10"
		    }]
		};


		connection.query("select * from course", function(err, rows, fields) {
		    if (err) {
		        throw err;
		    }

		    body.courses.forEach(function(course) {
		        var isNewCourse = true;
		        rows.forEach(function(row) {

		            if (row.title === course.title) {
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
		            console.log("New course found: " + course.title);
		        }

		    });


		});

		connection.end();

	//}
//});