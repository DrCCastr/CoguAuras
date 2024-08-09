import { ReplicatedFirst, Players, ContentProvider, TweenService } from "@rbxts/services";

const LoadingScreen = ReplicatedFirst.WaitForChild("LoadingScreen") as ScreenGui;
LoadingScreen.Parent = Players.LocalPlayer.WaitForChild("PlayerGui");

while (!game.IsLoaded()) task.wait();

let loadeds = 0;

const recourses = game.GetDescendants();
const maxRecourses = recourses.size();

recourses.forEach(function (recourse) {
	ContentProvider.PreloadAsync([recourse]);

	loadeds += 1;
	(LoadingScreen.WaitForChild("MainFrame").WaitForChild("MainText") as TextLabel).Text =
		"Loading (" + loadeds + "/" + maxRecourses + ")";
});

LoadingScreen.GetDescendants().forEach(function (frame) {
	if (frame.IsA("Frame")) {
		TweenService.Create(frame, new TweenInfo(1), { BackgroundTransparency: 1 }).Play();
	} else if (frame.IsA("TextLabel")) {
		TweenService.Create(frame, new TweenInfo(1), { BackgroundTransparency: 1, TextTransparency: 1 }).Play();
	}
});
