/* eslint-disable no-constant-condition */
import { Players, ReplicatedStorage, UserInputService, TweenService } from "@rbxts/services";

const player = Players.LocalPlayer;

const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const HUD = playerGui.WaitForChild("HUD");
const hotbar = HUD.WaitForChild("Hotbar");

const exampleTool = hotbar.WaitForChild("Example");

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

const backpackItems = [];

const tools = player.WaitForChild("Tools");
const hablities = player.WaitForChild("Habilities");

const items = [];
let equiped;

function update() {}

tools.ChildAdded.Connect(update);
tools.ChildRemoved.Connect(update);
hablities.ChildAdded.Connect(update);
hablities.ChildRemoved.Connect(update);
