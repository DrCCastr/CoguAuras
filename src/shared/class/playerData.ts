import { Players } from "@rbxts/services";
import * as ProfileModule from "shared/ext-mod/profile";

interface data {
	Cash: number;
	Inventory: string[];
}

const templateData: data = { Cash: 0, Inventory: [] };
const profileStore = ProfileModule.GetProfileStore("PlayerProfile", templateData);

const profiles: { [key: string]: ProfileModule.Profile | undefined } = {};

function playerAdded(player: Player) {
	const profile = profileStore.LoadProfileAsync("Player_" + player.UserId);

	if (profile !== undefined) {
		profile.AddUserId(player.UserId);
		profile.Reconcile(undefined, undefined);

		profile.ListenToRelease(function () {
			profiles[player.UserId] = undefined;

			player.Kick();
		});

		if (!player.IsDescendantOf(Players)) profile.Release();
		else profiles[player.UserId] = profile;
	} else player.Kick();
}

function getProfile(player: Player) {
	if (profiles[player.UserId] === undefined) {
		error("Profile dont exist for " + player.Name);
	}

	return profiles[player.UserId]!;
}

export class PlayerDataHandler {
	static init() {
		Players.GetPlayers().forEach(function (player) {
			task.spawn(playerAdded, player);
		});

		Players.PlayerAdded.Connect(playerAdded);
		Players.PlayerRemoving.Connect(function (player) {
			if (profiles[player.UserId]) profiles[player.UserId]!.Release();
		});
	}

	static get(player: Player, key: string) {
		const profile = getProfile(player);
		if (profile.Data[key] === undefined) {
			error("Data dont exist for " + key);
		}

		return profile.Data[key];
	}

	static set(player: Player, key: string, value: unknown) {
		const profile = getProfile(player);
		if (profile.Data[key] === undefined) {
			error("Data dont exist for " + key);
		}

		profile.Data[key] = value;
	}

	static update(player: Player, key: string, callback: (oldData: unknown) => unknown) {
		const profile = getProfile(player);

		const oldData = this.get(player, key);
		const newData = callback(oldData);

		this.set(player, key, newData);
	}
}
