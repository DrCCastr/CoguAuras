declare module "shared/ext-mod/profile" {
	interface Profile {
		Data: { [key: string]: unknown };
		Save(): void;
		Release(): void;
		AddUserId(userId: number): void;
		RemoveUserId(userId: number): void;
		ListenToRelease(callback: () => void): void;
		Reconcile(profileData: unknown, template: unknown): void;
		IsActive: boolean;
	}

	interface ProfileStore {
		LoadProfileAsync(profileKey: string): Profile | undefined;
		GlobalUpdateProfileAsync(profileKey: string, updateFunction: (data: unknown) => void): void;
		ReleaseProfile(profile: Profile): void;
	}

	function GetProfileStore(storeName: string, template: unknown): ProfileStore;
}
