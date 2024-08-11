import { Players, UserInputService } from "@rbxts/services";
import SafeFunctions from "shared/ext-mod/events";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();

const attacksKey = ["Z", "X", "C", "V", "F"];

function getMousePosition() {
	return mouse.Hit;
}

function getInputState(state: Enum.UserInputState) {
	return state === Enum.UserInputState.Begin ? 0 : 1;
}

function handleInputCall(state: Enum.UserInputState, attack: string) {
	SafeFunctions.InvokeServer("attack", 5, getMousePosition(), getInputState(state), attack);
}

function onInput(input: InputObject, processed: boolean) {
	const key = input.KeyCode.Name;

	if (processed || !attacksKey.includes(key)) return;

	handleInputCall(input.UserInputState, key);
}

function onClick() {
	SafeFunctions.InvokeServer("attack", 5, getMousePosition(), 1, "Click");
}

mouse.Button1Down.Connect(onClick);
UserInputService.TouchTap.Connect(onClick);

UserInputService.InputBegan.Connect(onInput);
UserInputService.InputEnded.Connect(onInput);
