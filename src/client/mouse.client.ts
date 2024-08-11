import { Players } from "@rbxts/services";
import SafeFunctions from "shared/ext-mod/events";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();

SafeFunctions.BindToInvokeClient("getMouse", function () {
	return mouse.Hit;
});
