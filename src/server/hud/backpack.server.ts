import SafeFunctions from "shared/ext-mod/events";

SafeFunctions.BindToInvokeServer("hud.backpack.unequip", function (player, ...args: unknown[]) {
	const Args = args[0] as unknown[];
	const tool = player.Character!.FindFirstChildOfClass("Tool");

	if (tool) tool.Parent = player.WaitForChild("Tools");
});

SafeFunctions.BindToInvokeServer("hud.backpack.equip", function (player, ...args: unknown[]) {
	const Args = args[0] as unknown[];
	const tool = player.WaitForChild("Tools").FindFirstChild(Args[0] as string);
	if (tool) tool.Parent = player.Character;

	return;
});
