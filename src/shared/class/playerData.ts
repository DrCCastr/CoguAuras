import { DataStoreService, Players } from "@rbxts/services";

const dataStore = DataStoreService.GetDataStore("playerData");
const instances: playerDataManager[] = [];

interface playerData {
	habilities: string[];
	habilitiesEquiped: string[];
	items: string[];
	itemsEquiped: string[];
	level: number;
	xp: number;
}

export class playerDataManager {
	player: Player;
	data: playerData;

	constructor(player: Player) {
		this.player = player;
		this.data = {
			habilities: [],
			habilitiesEquiped: [],
			items: [],
			itemsEquiped: [],
			level: 1,
			xp: 0,
		};

		this.loadData();
		instances.push(this);
	}

	async loadData() {
		try {
			const savedData = await dataStore.GetAsync(this.getDataKey());
			if (savedData !== undefined) {
				this.data = savedData as unknown as playerData;
			}
		} catch (e) {
			this.loadData();
		}
	}

	async flush() {
		try {
			dataStore.SetAsync(this.getDataKey(), this.data);
		} catch (e) {
			this.flush();
		}
	}

	getDataKey(): string {
		return `Player_${this.player.UserId}`;
	}
}

Players.PlayerRemoving.Connect(function (player) {
	instances.forEach(function (instance) {
		if ((instance.player = player)) {
			instance.flush();
		}
	});
});
