import { Players } from "@rbxts/services";
import { PlayerModule } from "shared/class/playerModule";

function handleCustomFolder(player: Player) {
	const Tools = new Instance("Folder");
	Tools.Name = "Tools";
	Tools.Parent = player;

	const Habilities = new Instance("Folder");
	Habilities.Name = "Habilities";
	Habilities.Parent = player;
}

function handlePlayerModule(player: Player) {
	new PlayerModule(player);
}

Players.PlayerAdded.Connect((player) => {
	handleCustomFolder(player);
	handlePlayerModule(player);
});
