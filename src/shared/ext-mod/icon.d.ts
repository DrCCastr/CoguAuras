declare const eventType: {
	selected: "selected";
	deselected: "deselected";
};

declare const alignment: ["Left", "Center", "Right"];

declare type eventType = (typeof eventType)[keyof typeof eventType];
declare type alignment = (typeof alignment)[number];

declare interface iconObj {
	setLabel(label: string): iconObj;
	bindEvent(event: eventType, callback: () => unknown): iconObj;
	setDropdown(iconsArray: iconObj[]): iconObj;
	align(alignment: alignment): iconObj;
}

declare interface icon {
	New(): iconObj;
}

declare const icon: icon;

export = icon;
