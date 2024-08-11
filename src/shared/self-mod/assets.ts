import { ReplicatedStorage } from "@rbxts/services";

export function asset(path: string) {
	const paths = path.split(".");
	let actualPath = ReplicatedStorage.WaitForChild("Assets");

	paths.forEach(function (path) {
		actualPath = actualPath.WaitForChild(path);
	});

	return actualPath;
}
