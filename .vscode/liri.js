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
        screen_name: "DavidBlight1",
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
        type: "track",
        query: "value",
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
            for (i = 0; i < 5; i++) {
                var results = data.tracks.items[i];
                var artist = results.artists[0].name;
                var songName = results.name;
                var previewLink = results.external_urls.spotify;
                var album = results.album.name;

                //Need: artist(s), song's name, preview link of song, album
                console.log("============");
                console.log("Artist: " + artist);
                console.log("Song: " + songName);
                console.log("Preview Link: " + previewLink);
                console.log("Album: " + album);
                console.log("============");
            };
        };
    });
};
// end Spotify

// Getting movie
function movieThis() {
    var queryURL = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=40e9cece";
    request(queryURL, function(error, response, body) {
        // If the request is successful (i.e. if the response status code is 200)
        if (error) {
            console.log("Error occurred: " + error);
            return;
        };

        if (value === "") {
            console.log("============");
            console.log("Movie Name: Mr.Nobody");
            console.log("Release Date: 2009-09-11");
            console.log("Synopsis: Mr. Nobody leads an ordinary existence");
            console.log("Average Vote: 8");
            console.log("Language: en");
            console.log("============");
        } else {
            console.log("============");
            console.log("Movie Name: " + JSON.parse(body).results[0].title);
            console.log("Release Date: " + JSON.parse(body).results[0].release_date);
            console.log("Synopsis: " + JSON.parse(body).results[0].overview);
            console.log("Average Vote: " + JSON.parse(body).results[0].vote_average);
            console.log("Language: " + JSON.parse(body).results[0].original_language);
            console.log("============");
        };
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