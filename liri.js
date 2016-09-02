var importedKeys = require('./keys.js');
// Status code for success is 0
var status = main();
console.log(status);

/**
 * main():
 * Outermost function called at program start.
 *
 * @return {number} 0 for success, 1 on error
 */
function main() {
	console.log("main()");
	//Checking if argument length is less than the 
	//minimum number of arguments for any command.
	if (process.argv.length < 3) {
		console.log("Error: invalid number of arguments."
			+ "\nUsage: node liri.js [command] [arg]"
			+ "\nList of Commands:"
			+ "\n\tmy-tweets"
			+ "\n\tspotify-this-song"
			+ "\n\tmovie-this"
			+ "\n\tdo-what-it-says");
		return(1);
	}
	else {
		//Creating Command Objects
		var commandObjects = [
			new CommandObject('my-tweets', getTweets),
			new CommandObject('spotify-this-song', getSong),
			new CommandObject('movie-this', getFilm),
			new CommandObject('do-what-it-says', doThis)
		];
		//Call to helper function, parseCommand()
		return parseCommand(process.argv[2], process.argv.slice(3, process.argv.length).join(' '), commandObjects);
	}
}

/**
 * parseCommand():
 * Matches the user's command to a list of Command Objects,
 * and calls the corresponding handler function.
 *
 * @param {string} clCommand the command from the command line interface
 * @param {string} clArgs the arguments which will be passed to the command
 * @param {CommandObject[]} commandObjects array of CommandObjects
 * @return {number} 0 for success, 1 on error
 */
function parseCommand(clCommand, clArgs, commandObjects) {
	console.log("parseCommand()");
	console.log(clArgs);
	for(var i = 0; i < commandObjects.length; i++) {
		//Find the matching CommandObject text,
		//and pass clArgs to its handler function
		if (clCommand === commandObjects[i].commandText) {
			return (commandObjects[i].commandHandler(clArgs));
		}
	}
	//Error: No matching command for cli argument found
	var outputString = "Error: '" + clCommand + "' not found." 
				+ "\nPlease use one of the following commands: ";
	for(var i = 0; i < commandObjects.length; i++) {
		outputString += "\n " + commandObjects[i].commandText;
	}
	console.log(outputString);
	return(1);
}

/**
 * getTweets():
 * Function handler for my-tweets command that uses
 * the node module, 'twitter', to log a user's
 * fifteen most recent tweets.
 *
 * @return {number} 0 for success, 1 on error
 */
function getTweets() {
	console.log("getTweets()");
	var Twitter = require('twitter');
 
	var client = new Twitter(importedKeys.twitterKeys);
	 
	var params = {
		screen_name: 'womcauliff',
		count: 20
	};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				console.log("\n" + (i+1) + "\t" + tweets[i].created_at);
				console.log("\t" + tweets[i].text);
			}
		}
		else {
			console.log(error);
			return(1);
		}
	});
	return(0);	
}

/**
 * getSong():
 * Function handler for spotify-this-song command that uses
 * the node module, 'spotify', to log information
 * for a given song title
 * @return {number} 0 for success, 1 on error
 */
function getSong() {
	console.log("getSong()");

	/*
	 * Normally, without user input, we would return with an error
	 * However, default input was specified in the assignment.
	 * ("The Sign" by Ace of Base)
	 */
	// if (process.argv[3] === undefined) {
	// 	console.log("Error: missing argument."
	// 		+ "\nUsage: node liri.js " + this.commandText + " argument(s)");
	// 	return(1);
	// }
	var argString = "";
	if(process.argv[3] === undefined) {
		argString = "The Sign Ace of Base";
	}
	else {
		for (var i = 3; i < process.argv.length; i++) {
			argString += process.argv[i] + " ";
		}
		argString.trim();
		console.log("query: " + argString);
	}

	var spotify = require('spotify');
	 
	spotify.search({ type: 'track', query: argString }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return (1);
	    }
	    else if (data.tracks.total == 0) {
	    	console.log("No results found.");
	    	return(0);
	    }
	 	var outputString =
			"\tSong Name: " + data.tracks.items[0].name
	 		+ "\n\tAlbum: " + data.tracks.items[0].album.name
	 		+ "\n\tArtist(s): " + data.tracks.items[0].artists[0].name
	 		+ "\n\tPreview Link: " + data.tracks.items[0].preview_url;
	 	console.log(outputString);
	});
	return(0);
}

/**
 * getFilm():
 * Function handler for movie-this command that uses
 * the node module, 'request', to access the OMDB and
 * log information for a given film title
 *
 * @return {number} 0 for success, 1 on error
 */
function getFilm() {
	console.log("getFilm()");
	/*
	 * Normally, without user input, we would return with an error
	 * However, default input was specified in the assignment.
	 * ("Mr. Nobody")
	 */
	// if (process.argv[3] === undefined) {
	// 	console.log("Error: missing argument."
	// 		+ "\nUsage: node liri.js " + this.commandText + " argument(s)");
	// 	return(1);
	// }
	var argString = "";
	if(process.argv[3] === undefined) {
		argString = "Mr. Nobody";
	}
	else {
		argString = process.argv[3]
		for (var i = 4; i < process.argv.length; i++) {
			argString += "+" + process.argv[i];
		}
		argString.trim();
		console.log(argString);
	}

	var request = require('request');
	var uri = 'http://www.omdbapi.com/?t=' 
		+ argString 
		+ '&y='
		+ '&plot=short'
		+ '&r=json'
		+ '&tomatoes=true';
	console.log(uri);
	request(uri, function (error, response, body) {
		if (error) {
			console.log(error);
			return(1);
		}
		else if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
			var outputString =
				"\tTitle: " + body["Title"]
				+ "\n\tYear: " + body["Year"]
				+ "\n\tCountry Produced: " + body["Country"]
				+ "\n\tLanguage: " + body["Language"]
				+ "\n\tPlot: " + body["Plot"]
				+ "\n\tActors: " + body["Actors"]
				+ "\n\tIMDB Rating: " + body["imdbRating"]
				+ "\n\tRotten Tomatoes Rating: " + body["tomatoRating"]
				+ "\n\tRotten Tomatoes URL: " + body["tomatoURL"];
			console.log(outputString);
		}
		else {
			console.log(response);
			return(1);
		}
	});
	return(0);
}

/**
 * doThis():
 * Function handler for do-what-it-says command that uses
 * parses a local file, 'random.txt' for a LIRI command
 * and calls the relevant command.
 *
 * @return {number} 0 for success, 1 on error
 */
function doThis() {
	console.log("doThis()");
	var fs = require('fs');

	fs.readFile("random.txt", "utf8", function(error, data) {

		if(error) {
			console.log(error);
			return(1);
		}

		// Split file by commas
		var dataArr = data.split(',');

		// We will then re-display the content with the split for aesthetics.
		console.log(dataArr);
	});
	return(0);
}

/**
 * CommandObject():
 *
 * @param {string }commandText the text to execute the command
 * @param {function} commandHandler the function called by the command
 * @return a Command Object
 */
function CommandObject(commandText, commandHandler) {
	this.commandText = commandText;
	this.commandHandler = function(additionalParams) {
		return commandHandler(additionalParams);
	}
}