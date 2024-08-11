import * as data from "./cmdFiles/data";

export function getCommand(name: string): undefined | ((player: Player, args: string[]) => void) {
	if (name === "showData") return data.showData;
	if (name === "setData") return data.setData;
}
