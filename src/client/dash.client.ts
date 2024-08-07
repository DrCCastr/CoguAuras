import { createAnim, anims } from "shared/self-mod/animations";

import { Players, UserInputService, RunService } from "@rbxts/services";

let other = false;
let db = false;

UserInputService.InputBegan.Connect((input) => {
	if (input.KeyCode === Enum.KeyCode.Q && !db) {
		db = true;
		const player = Players.LocalPlayer;
		const character = player.Character;
		if (character) {
			const humanoid = character.FindFirstChildOfClass("Humanoid");
			const rootPart = character.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
			if (humanoid && rootPart) {
				let impulse = 0.75;
				const con: RBXScriptConnection = RunService.RenderStepped.Connect((dt) => {
					rootPart.CFrame = rootPart.CFrame.add(humanoid.MoveDirection.mul(impulse));
					impulse -= dt * 2.5;
					if (impulse <= 0) {
						con.Disconnect();
					}
				});

				other = !other;
				if (other) {
					humanoid.LoadAnimation(createAnim(anims.human.dash.d_1)).Play(0.1, 1, 1);
				} else {
					humanoid.LoadAnimation(createAnim(anims.human.dash.d_2)).Play(0.1, 1, 1);
				}
			}
		}
		task.wait(0.25);
		db = false;
	}
});
