import SafeFunctions from "shared/ext-mod/events";

SafeFunctions.BindToInvokeServer("hud.backpack.unequip", function (player) {
	const tool = player.Character!.FindFirstChildOfClass("Tool");

	if (tool) tool.Parent = player.WaitForChild("Tools");
});

SafeFunctions.BindToInvokeServer("hud.backpack.equip", function (player, toolName) {
	const tool = player.WaitForChild("Tools").FindFirstChild(toolName as string);
	if (tool) tool.Parent = player.Character;

	return;
});
