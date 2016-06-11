var request = require("request");
var processor = require("./courseprocessor");

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
        // process courses to find price drops 
       processor.processCourses(body); 

    } else {
        console.log("Error request course info from Udemy");
    }
});