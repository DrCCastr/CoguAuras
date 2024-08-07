import { Players } from "@rbxts/services";

const player = Players.LocalPlayer;

const Tools = new Instance("Folder");
Tools.Name = "Tools";
Tools.Parent = player;

const Hablities = new Instance("Folder");
Hablities.Name = "Hablities";
Hablities.Parent = player;
