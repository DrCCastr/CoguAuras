import { TweenService, Workspace } from "@rbxts/services";
import { PlayerModule } from "shared/class/playerModule";
import { asset } from "shared/self-mod/assets";

export const Data = {
	Cooldowns: {
		Z: 2.5,
	},
};

const attackData: { [key: number]: { [key: string]: { [key: string]: unknown } } } = [];

function delay(time: number, callback: () => unknown) {
	task.spawn(function () {
		task.wait(time);
		callback();
	});
}

export function Z_Begin(player: Player, hit: CFrame) {
	const module = PlayerModule.getInstanceByPlayerId(player.UserId);

	attackData[player.UserId] = {};
	attackData[player.UserId].Z = {};

	module?.anchorAt(undefined);

	const Asteroid = asset("ToolsAssets.LunarAura.LunarAsteroid").Clone() as Model;
	attackData[player.UserId].Z.Asteroid = Asteroid;

	Asteroid.PivotTo(player.Character!.PrimaryPart!.CFrame.add(new Vector3(0, -10, 10)));
	Asteroid.Parent = Workspace;

	attackData[player.UserId].Z.AstTween = true;
	TweenService.Create(Asteroid.PrimaryPart!, new TweenInfo(0.25, Enum.EasingStyle.Quad, Enum.EasingDirection.InOut), {
		CFrame: Asteroid.PrimaryPart!.CFrame.add(new Vector3(0, 20, 0)),
	}).Play();

	delay(0.25, function () {
		attackData[player.UserId].Z.AstTween = false;
	});
}

export function Z_End(player: Player, hit: CFrame) {
	const module = PlayerModule.getInstanceByPlayerId(player.UserId);

	const Asteroid = attackData[player.UserId].Z.Asteroid as Model;
	module?.unAnchor();

	while (attackData[player.UserId].Z.AstTween === true) task.wait();

	attackData[player.UserId].Z = {};
	TweenService.Create(Asteroid.PrimaryPart!, new TweenInfo(0.25), { CFrame: hit }).Play();
}
