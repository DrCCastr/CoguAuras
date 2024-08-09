import { Players, StarterGui } from "@rbxts/services";

const player = Players.LocalPlayer;

StarterGui.SetCoreGuiEnabled("Backpack", false);
const Tools = new Instance("Folder");
Tools.Name = "Tools";
Tools.Parent = player;

const Hablities = new Instance("Folder");
Hablities.Name = "Hablities";
Hablities.Parent = player;
