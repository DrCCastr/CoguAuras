import SafeFunctions from "shared/ext-mod/events";
import * as toolMap from "server/combat/toolMap";

const charConnections: { [key: number]: RBXScriptConnection[] } = [];
const activesCooldown: { [key: number]: { [key: string]: boolean } } = [];

function delay(time: number, callback: () => unknown) {
	task.spawn(function () {
		task.wait(time);
		callback();
	});
}

function getToolModule(tool: string) {
	return toolMap.getTool(tool);
}

const attacksKey = ["Z", "X", "C", "V", "F", "Click"];

SafeFunctions.BindToInvokeServer("attack", function (player, mousePos, state, attack) {
	const tool = player.Character?.FindFirstChildOfClass("Tool");
	let suffix = "";

	if (!tool || !tool.FindFirstChild("Combat")) return;
	if (!attacksKey.includes(attack as string)) return;
	if (activesCooldown[player.UserId] && activesCooldown[player.UserId][attack as string]) return;

	suffix = state === 0 ? "_Begin" : "_End";

	const module = getToolModule((tool.WaitForChild("Id") as StringValue).Value);
	if (module !== undefined) {
		const methodName = (attack + suffix) as keyof toolMap.ToolModule;

		if (typeIs(module[methodName], "function")) {
			if (state === 1) {
				activesCooldown[player.UserId] =
					activesCooldown[player.UserId] !== undefined ? activesCooldown[player.UserId] : {};
				activesCooldown[player.UserId][attack as string] = true;

				delay(module.Data.Cooldowns[attack as string], function () {
					activesCooldown[player.UserId][attack as string] = false;
				});
			}

			(module[methodName] as Function)(player, mousePos as CFrame);
		} else {
			warn(`Method ${methodName} not found on tool ${tool.Name}`);
		}
	}
});

SafeFunctions.BindToInvokeServer("combatHandler.character", function (player, char) {
	charConnections[player.UserId] = [];

	charConnections[player.UserId].push(
		(char as Model).ChildAdded.Connect(function (tool) {
			if (!tool.IsA("Tool") || !tool.FindFirstChild("Combat")) return;

			const module = getToolModule((tool.WaitForChild("Id") as StringValue).Value);
			const mousePos = SafeFunctions.InvokeClient(player, "mouse.getPos", 5) as unknown as CFrame;

			if (module && typeIs(module.Equip, "function")) {
				module.Equip(player, mousePos);
			} else {
				warn(`Method Equip not found on tool ${tool.Name}`);
			}
		}),
	);

	charConnections[player.UserId].push(
		(char as Model).ChildRemoved.Connect(function (tool) {
			if (!tool.IsA("Tool") || !tool.FindFirstChild("Combat")) return;

			const module = getToolModule((tool.WaitForChild("Id") as StringValue).Value);
			const mousePos = SafeFunctions.InvokeClient(player, "mouse.getPos", 5) as unknown as CFrame;

			if (module && typeIs(module.Unequip, "function")) {
				module.Unequip(player, mousePos);
			} else {
				warn(`Method Unequip not found on tool ${tool.Name}`);
			}
		}),
	);
});
