import { Players } from "@rbxts/services";
import { PlayerDataHandler } from "shared/class/playerData";
import { asset } from "shared/self-mod/assets";

PlayerDataHandler.init();

Players.PlayerAdded.Connect(function (player) {
	PlayerDataHandler.waitProfile(player);

	(PlayerDataHandler.get(player, "Inventory") as string[]).forEach((item) => {
		const itemObj = asset("Tools." + item).Clone();

		itemObj.Parent = player.WaitForChild("Tools");
	});
});
