export const anims = {
	human: {
		dash: {
			d_1: "17787210869",
			d_2: "17819394877",
		},
	},
};

export function createAnim(anim: String): Animation {
	const anima = new Instance("Animation");
	anima.AnimationId = "rbxassetid://" + anim;

	return anima;
}
