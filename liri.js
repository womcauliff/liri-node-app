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
			+ "\nUsage: node liri.js [command] [arg]");
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
	for(var i = 0; commandObjects.length - 1; i++) {
		if (clCommand === commandObjects[i].commandText) {
			return (commandObjects[i].commandHandler());
		}
	}
	//Error: No matching command for cli argument found
	var outputString = "Error: '" + clCommand + "' not found." 
				+ "\nPlease use one of the following commands: ";
	for(var i = 0; i < commands.length - 1; i++) {
		outputString += "\n " + commands[i];
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
 
	var client = new Twitter({
	  consumer_key: importedKeys.twitterKeys.consumer_key,
	  consumer_secret: importedKeys.twitterKeys.consumer_secret,
	  access_token_key: importedKeys.twitterKeys.access_token_secret,
	  access_token_secret: importedKeys.twitterKeys.access_token_secret
	});
	 
	var params = {screen_name: 'nodejs'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets);
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
	if (process.argv[3] === "") {
		console.log("Error: missing argument."
			+ "\nUsage: node liri.js " + this.commandText + " argument");
		return(1);
	}
	var argString = "";
	for (var i = 3; i < process.argv.length; i++) {
		argString += process.argv[i] + " ";
	}
	argString.trim();
	console.log("query: " + argString);

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
	if (process.argv[3] === undefined) {
		console.log("Error: missing argument."
			+ "\nUsage: node liri.js " + this.commandText + " argument");
		return(1);
	}
	var argString = "";
	for (var i = 3; i < process.argv.length; i++) {
		argString += process.argv[i] + " ";
	}
	argString.trim();
	console.log(argString);
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