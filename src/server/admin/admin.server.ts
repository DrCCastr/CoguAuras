import { Players } from "@rbxts/services";
import * as cmd from "server/admin/cmd";

const prefix = "&gt;";

const admins = [4073867946];

Players.PlayerAdded.Connect((player) => {
	if (admins.includes(player.UserId)) {
		player.Chatted.Connect((message) => {
			const commandName = message.split(" ")[0].split(prefix)[1];

			if (cmd.getCommand(commandName) !== undefined) {
				const args = parseArgs(message);
				cmd.getCommand(commandName)!(player, args);
			}
		});
	}
});
function parseArgs(input: string): string[] {
	const args: string[] = [];
	let inParenthesis = false;
	let currentArg = "";
	let currentGroup = "";

	for (const char of input) {
		if (char === "(") {
			if (inParenthesis) {
				currentGroup += char;
			} else {
				inParenthesis = true;
				currentGroup = "";
			}
		} else if (char === ")") {
			if (inParenthesis) {
				inParenthesis = false;
				args.push(currentGroup);
			} else {
				currentArg += char;
			}
		} else if (char === " " && !inParenthesis) {
			if (currentArg !== "") {
				args.push(currentArg);
			}
			currentArg = "";
		} else {
			if (inParenthesis) {
				currentGroup += char;
			} else {
				currentArg += char;
			}
		}
	}

	if (currentArg !== "") {
		args.push(currentArg);
	}

	args.shift();
	return args;
}
