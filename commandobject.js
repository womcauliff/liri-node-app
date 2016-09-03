/**
 * CommandObject():
 *
 * @param {string} commandText the text to execute the command
 * @param {function} commandHandler the function called by the command
 * @return a Command Object
 */
var CommandObject = function (commandText, commandHandler) {
	this.commandText = commandText;
	this.commandHandler = function(additionalParams) {
		return commandHandler(additionalParams);
	}
}

module.exports = CommandObject;