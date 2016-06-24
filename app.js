var request = require("request");
var processor = require("./courseprocessor");

// get course information from Udemy 
var options = {
    url: "https://www.udemy.com/api-2.0/courses/",
    auth: {
        user: process.env.UDEMY_CLIENT_ID,
        password: process.env.UDEMY_CLIENT_SECRET
    }
};

//var nextUrl; 
//do {
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // process courses to find price drops 
           processor.processCourses(body); 

        } else {
            console.log("Error request course info from Udemy");
        }

        nextUrl = JSON.parse(body).next; 
    });
//} while (nextUrl !== null); 