// Gets keys from keys.js file
var keys = require("./keys.js");

// Requires spotify and twitter
var spotify = require("spotify");
var twitter = require("twitter");

// Requires (via Request) omdb apikey:40e9cece
var request = require("request");

// Requires "fs"
var fs = require("fs");

var nodeArgs = process.argv;
var query = [];

for (var i = 2; i < nodeArgs.length; i++) {
    query.push(nodeArgs[i]);
};

// var action = process.argv
var argOne = query.splice(0, 1);
var argTwo = query.join(" ");
var action = String(argOne);
var value = String(argTwo);

console.log("Searching for " + value);
console.log("What command? " + action);

// action statement to declare what action to take to get value
switch (action) {
    case "my-tweets":
        myTweets();
        logAction();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        logAction();
        break;

    case "movie-this":
        movieThis();
        logAction();
        break;

    case "do-what-it-says":
        doThis();
        logAction();
        break;
};

//Commands for Liri for "my-tweets"

function myTweets() {

    var twitterKeys = keys.twitterKeys;

    var client = new twitter({

        consumer_key: twitterKeys.consumer_key,
        consumer_secret: twitterKeys.consumer_secret,
        access_token_key: twitterKeys.access_token_key,
        access_token_secret: twitterKeys.access_token_secret

    });

    var params = {
        screen_name: "@DavidBlight1",
        count: 20
    };

        //Calling the method for the twitter 
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        };

        for (var i = 0; i < tweets.length; i++) {
            console.log("============");
            console.log(tweets[i].text);
            console.log("============");
        };
    });
}; 
// end Twitter

// Getting song from Spotify
function spotifyThisSong() {
    spotify.search({
        // client_id: '9453cc56401f4c7eb1c39a888f4e6a94',
        // client_secret: 'd82a9b41c72743c7800ea04e7a065944',
        type: "track",
        query: value,
    }, function(err, data) {
        if (err) {
            console.log("Error occurred: " + err);
            return;
        };

        // * if no song is provided then program defaults to "The Sign" by Ace of Base
        if (value === "") {
            console.log("============");
            console.log("Artist: Ace of Base");
            console.log("Song: The Sign");
            console.log("Preview Link: https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE");
            console.log("Album: The Sign");
            console.log("============");
        } else {
                //Need: artist(s), song's name, preview link of song, album
                console.log(data)
                console.log("============");
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song: " + data.tracks.items[0].name);
                console.log("Preview Link: " + data.tracks.items[0].preview_url);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("============");

            };
        
    });
};
// end Spotify

// Getting movie
function movieData(){
	console.log("Movie Search");

	//same as above, test if search term entered
	var searchMovie;
	if(secondCommand === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = secondCommand;
	};

	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=short&tomatoes=true&r=json&apikey=40e9cece';
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
	    }
    });
};
// end OMDB

// "`do-what-it-says"
function doThis() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        var content = data.split(",");
        // var array = data.toString().split("\n");
        
        action = content[0];
        value = content[1];

        switch (action) {
            case "my-tweets":
                myTweets();
                break;

            case "spotify-this-song":
                spotifyThisSong();
                break;

            case "movie-this":
                movieThis();
                break;

            case "do-what-it-says":
                doThis();
                break;
        };
    });
};
// end do-what-it-says

function logAction() {
    var logItem = "\nSearch String:" + action + "," + value;
    console.log(logItem);

    fs.appendFile("log.txt", logItem, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Content Added!");
        };
    });
};