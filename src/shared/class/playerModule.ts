import { RunService } from "@rbxts/services";

const instances: PlayerModule[] = [];

export class PlayerModule {
	public player: Player;

	public lastHitExecutor: Player | string;
	public lastHitContext: string;

	public anchorConnection: RBXScriptConnection | undefined;

	constructor(player: Player) {
		this.player = player;

		this.lastHitExecutor = "";
		this.lastHitContext = "";

		this.anchorConnection = undefined;

		instances.push(this);
	}

	static getInstanceByPlayerId(playerId: number) {
		for (const playerInstance of instances) {
			if (playerInstance.player.UserId === playerId) return playerInstance;
		}
	}

	takeDamage(damage: number, executor: Player | string, context: string) {
		this.lastHitExecutor = executor;
		this.lastHitContext = context;

		this.Humanoid()?.TakeDamage(damage);
	}

	anchorAt(pos: Vector3 | undefined) {
		this.unAnchor();

		if (pos === undefined) {
			pos = this.Root()?.Position.add(new Vector3(0.1, 0, 0.1));
		}

		const root = this.Root();
		if (root) {
			let linearVelocity = root.FindFirstChildOfClass("LinearVelocity");

			if (!linearVelocity) {
				linearVelocity = new Instance("LinearVelocity");
				linearVelocity.Parent = root;
				linearVelocity.Attachment0 = root.WaitForChild("RootAttachment") as Attachment;
				linearVelocity.MaxForce = 1e5;
			}

			this.anchorConnection = RunService.Heartbeat.Connect(() => {
				const dif = pos!.sub(root.Position);
				linearVelocity!.VectorVelocity = dif.Unit.mul(5).mul(dif.Magnitude);
			});
		}
	}

	unAnchor() {
		const root = this.Root();
		if (root) {
			const linearVelocity = root.FindFirstChildOfClass("LinearVelocity");
			if (linearVelocity) {
				linearVelocity.VectorVelocity = new Vector3(0, 0, 0);
				linearVelocity.Destroy();
			}
		}
		this.anchorConnection?.Disconnect();
		this.anchorConnection = undefined;
	}

	private Character() {
		return this.player.Character;
	}

	private Humanoid() {
		return this.Character()?.FindFirstChildOfClass("Humanoid");
	}

	private Root() {
		return this.Character()?.PrimaryPart;
	}
}
