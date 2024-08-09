/* eslint-disable no-constant-condition */
import { Players, ReplicatedStorage, UserInputService, TweenService } from "@rbxts/services";

const player = Players.LocalPlayer;

const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const HUD = playerGui.WaitForChild("HUD") as GuiObject;
const hotbarItems = HUD.WaitForChild("Hotbar").WaitForChild("Items") as Frame;
const exampleTool = hotbarItems.WaitForChild("Example") as Frame;

const itemsConnections: RBXScriptConnection[][] = [];
const connectionNumberMap = [
	Enum.KeyCode.One,
	Enum.KeyCode.Two,
	Enum.KeyCode.Three,
	Enum.KeyCode.Four,
	Enum.KeyCode.Five,
	Enum.KeyCode.Six,
	Enum.KeyCode.Seven,
	Enum.KeyCode.Eight,
	Enum.KeyCode.Nine,
	Enum.KeyCode.Zero,
];

const tools = player.WaitForChild("Tools") as Folder;
const hablities = player.WaitForChild("Hablities") as Folder;

const toolItems: Tool[] = [];
let equiped: Tool | undefined;

function handleUnequip() {
	equiped!.Parent = tools;
	equiped = undefined;
}

function handleEquip(tool: Tool) {
	if (equiped) {
		if (equiped === tool) handleUnequip();
		else {
			handleUnequip();
			handleEquip(tool);
		}

		return;
	}

	tool.Parent = player.Character;
	equiped = tool;
}

function makeToolItemConnection(frame: Frame, tool: Tool, i: number) {
	const connections: RBXScriptConnection[] = [];

	connections.push(
		(frame.WaitForChild("Button") as TextButton).Activated.Connect(function () {
			handleEquip(tool);
		}),
	);
	connections.push(
		UserInputService.InputBegan.Connect(function (input, processed) {
			if (processed) return;
			if (input.KeyCode === connectionNumberMap[i]) {
				handleEquip(tool);
			}
		}),
	);

	itemsConnections.push(connections);
}

function updateToolItems() {
	toolItems.clear();
	tools.GetChildren().forEach(function (tool) {
		toolItems.push(tool as Tool);
	});
	if (equiped) toolItems.push(equiped);
	toolItems.sort((a, b) => a.Name < b.Name);
}

function update() {
	updateToolItems();
	itemsConnections.forEach(function (connections) {
		connections.forEach(function (connection) {
			connection.Disconnect();
		});
	});
	itemsConnections.clear();

	const oldFrames = hotbarItems.GetChildren();

	toolItems.forEach(function (tool, i) {
		const itemFrame = exampleTool.Clone();

		makeToolItemConnection(itemFrame, tool, i);

		(itemFrame.WaitForChild("HotKey").WaitForChild("TextLabel") as TextLabel).Text = tostring(i + 1);
		itemFrame.Name = "Tool_" + tool.Name;
		itemFrame.Parent = hotbarItems;
		itemFrame.Visible = true;
	});

	oldFrames.forEach(function (frame) {
		if (frame.Name.split("Tool").size() > 1) frame.Destroy();
	});
}

tools.ChildAdded.Connect(update);
tools.ChildRemoved.Connect(update);
hablities.ChildAdded.Connect(update);
hablities.ChildRemoved.Connect(update);
