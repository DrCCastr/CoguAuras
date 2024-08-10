import { Players } from "@rbxts/services";
import { asset } from "shared/self-mod/assets";

function handleCustomFolder(player: Player) {
	const Tools = new Instance("Folder");
	Tools.Name = "Tools";
	Tools.Parent = player;

	const Habilities = new Instance("Folder");
	Habilities.Name = "Habilities";
	Habilities.Parent = player;
}

Players.PlayerAdded.Connect((player) => {
	handleCustomFolder(player);
});
