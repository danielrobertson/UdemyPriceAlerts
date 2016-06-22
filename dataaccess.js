var mysql = require("mysql");

// establish database connection 
var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_UDEMY_PRICES
});

connection.connect();

/** 
 * Retrieves and returns all course price data 
 */ 
exports.getAllPriceData = function(callback) {
	connection.query("select * from price", callback); 
}; 

/** 
 * Inserts a given course into the data store 
 */ 
exports.insertCourse = function(course) {
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

/** 
 * Retrieves and returns all users 
 */ 
 exports.getAllUsers = function(callback) {
    connection.query("select * from users", callback); 
 };