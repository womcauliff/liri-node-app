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
			new CommandObjectConstructor('my-tweets', getTweets),
			new CommandObjectConstructor('spotify-this-song', getSong),
			new CommandObjectConstructor('movie-this', getFilm),
			new CommandObjectConstructor('do-what-it-says', doThis)
		];
		//Call to helper function, parseCommand()
		return parseCommand(process.argv[2], commandObjects);
	}
}

/**
 * parseCommand():
 * Matches the user's command to a list of Command Objects,
 * and calls the corresponding handler function.
 *
 * @param {string} clCommand the command from the command line interface
 * @param {CommandObjectConstructor[]} commandObjects array of CommandObjects
 * @return {number} 0 for success, 1 on error
 */
function parseCommand(clCommand, commandObjects) {
	console.log("parseCommand()");
	for(var i = 0; i < commandObjects.length; i++) {
		if (clCommand === commandObjects[i].commandText) {
			return (commandObjects[i].commandHandler());
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
	 
	var params = {screen_name: 'womcauliff'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    //console.log(JSON.stringify(tweets, null, 2));
	    for (var i = 0; i < tweets.length; i++) {
	    	console.log("-- " + tweets[i].text);
	    }
	  }
	  else {
	  	console.log(error);
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
	 	
	 	console.log("   Song Name: " + data.tracks.items[0].name);
	 	console.log("       Album: " + data.tracks.items[0].album.name);
	 	console.log("   Artist(s): " + data.tracks.items[0].artists[0].name);
	 	console.log("Preview Link: " + data.tracks.items[0].preview_url);
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
				"\nTitle: " + body["Title"]
				+ "\nYear: " + body["Year"]
				+ "\nCountry Produced: " + body["Country"]
				+ "\nLanguage: " + body["Language"]
				+ "\nPlot: " + body["Plot"]
				+ "\nActors: " + body["Actors"]
				+ "\nIMDB Rating: " + body["imdbRating"]
				+ "\nRotten Tomatoes Rating: " + body["tomatoRating"]
				+ "\nRotten Tomatoes URL: " + body["tomatoURL"];
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
	return(0);
}

/**
 * Command Object Constructor():
 *
 * @param {string }commandText the text to execute the command
 * @param {function} commandHandler the function called by the command
 * @return a Command Object
 */
function CommandObjectConstructor(commandText, commandHandler) {
	var c = {
		commandText: commandText,
		commandHandler: commandHandler
	}
	return c;
}