import { HttpService, Players } from "@rbxts/services";
import { PlayerDataHandler } from "shared/class/playerData";

export async function showData(caller: Player, args: string[]) {
	const playerNick = args[0];
	const mode = args[1];

	let key = args[2];
	try {
		const userId = await Players.GetUserIdFromNameAsync(playerNick);
		const player = Players.GetPlayerByUserId(userId);

		if (!player) {
			print("Player not found: " + playerNick);
			return;
		}

		if (mode === "-root") key = "root";

		const data = PlayerDataHandler.get(player, key);
		if (data !== undefined) {
			print(data);
		} else {
			print("No data found for key: " + key);
		}
	} catch (err) {
		print("Error retrieving player data for " + playerNick + ": " + err);
	}
}

export async function setData(caller: Player, args: string[]) {
	const playerNick = args[0];
	const key = args[1];
	const valueStr = args[2];
	const _type = args[3];

	try {
		const userId = await Players.GetUserIdFromNameAsync(playerNick);
		const player = Players.GetPlayerByUserId(userId);

		if (!player) {
			print("Player not found: " + playerNick);
			return;
		}

		let value: unknown;

		switch (_type) {
			case "number":
				value = tonumber(valueStr);
				if (value === undefined) {
					print("Invalid number value: " + valueStr);
					return;
				}
				break;
			case "boolean":
				value = valueStr.lower() === "true";
				break;
			case "json":
				value = HttpService.JSONDecode(valueStr);
				if (value === undefined) {
					print("Invalid JSON value: " + valueStr);
					return;
				}
				break;
			case "string":
			default:
				value = valueStr;
				break;
		}

		PlayerDataHandler.set(player, key, value);
		print(`Data set for ${playerNick}: ${key} = ${value}`);
	} catch (err) {
		print("Error setting player data for " + playerNick + ": " + err);
	}
}
