import { Players, StarterGui } from "@rbxts/services";
import SafeFunctions from "shared/ext-mod/events";

const player = Players.LocalPlayer;

StarterGui.SetCoreGuiEnabled("Backpack", false);

player.CharacterAppearanceLoaded.Connect(function (char) {
	SafeFunctions.InvokeServer("combatHandler.character", 5, char);
});
