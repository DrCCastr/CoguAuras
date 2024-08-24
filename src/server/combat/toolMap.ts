import * as lunarAura from "server/combat/tools/lunarAura";

export interface ToolModule {
	Data: {
		Cooldowns: { [key: string]: number };
	};
	Passive: (player: Player, hit: CFrame) => void;
	Equip: (player: Player, hit: CFrame) => void;
	Unequip: (player: Player, hit: CFrame) => void /*
	Click_Begin: (player: Player, hit: CFrame) => void;
	Click_End: (player: Player, hit: CFrame) => void;
	Z_Begin: (player: Player, hit: CFrame) => void;
	Z_End: (player: Player, hit: CFrame) => void;
	X_Begin: (player: Player, hit: CFrame) => void;
	X_End: (player: Player, hit: CFrame) => void;
	C_Begin: (player: Player, hit: CFrame) => void;
	C_End: (player: Player, hit: CFrame) => void;
	V_Begin: (player: Player, hit: CFrame) => void;
	V_End: (player: Player, hit: CFrame) => void;
	F_Begin: (player: Player, hit: CFrame) => void;
	F_End: (player: Player, hit: CFrame) => void;*/;
}

export function getTool(name: string) {
	if (name === "lunarAura") {
		return lunarAura as unknown as ToolModule;
	}
}
