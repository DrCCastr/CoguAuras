import { Players } from "@rbxts/services";

Players.PlayerAdded.Connect((player) => {
	const Tools = new Instance("Folder");
	Tools.Name = "Tools";
	Tools.Parent = player;

	const Habilities = new Instance("Folder");
	Habilities.Name = "Habilities";
	Habilities.Parent = player;
});
