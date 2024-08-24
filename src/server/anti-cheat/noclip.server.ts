import { Players, Workspace } from "@rbxts/services";

function delay(time: number, callback: () => unknown) {
	task.spawn(function () {
		task.wait(time);
		callback();
	});
}

Players.PlayerAdded.Connect(function (player) {
	player.CharacterAppearanceLoaded.Connect(function (char) {
		let previousPosition = char.PrimaryPart!.Position;

		while (char) {
			const currentPosition = char.PrimaryPart!.Position;
			const direction = currentPosition.sub(previousPosition);
			const raycastResult = Workspace.Raycast(previousPosition, direction);

			if (
				raycastResult?.Instance &&
				raycastResult.Instance.CanCollide === true &&
				raycastResult.Instance.Parent !== char
			) {
				char.PivotTo(new CFrame(previousPosition).sub(direction.mul(2)));
				char.PrimaryPart!.Anchored = true;

				delay(1, function () {
					char.PrimaryPart!.Anchored = false;
				});
			}

			previousPosition = char.PrimaryPart!.Position;
			task.wait();
		}
	});
});
