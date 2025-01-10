export function getStateMachine(prizeIndex: number) {
	let firstSelected: number;
	return function stateMachine(selected: number | undefined): Array<DoorState> {
		if (typeof selected === "number") {
			if (typeof firstSelected === "undefined") {
				firstSelected = selected;
			}
			const showDoor = getRandomInt(2);
			return [
				{
					isPrize: prizeIndex === 0,
					selected: selected === 0,
					shown: selected !== 0,
				},
				{
					isPrize: prizeIndex === 1,
					selected: selected === 1,
					shown: selected !== 1,
				},
				{
					isPrize: prizeIndex === 2,
					selected: selected === 2,
					shown: selected !== 2,
				},
			];
		} else {
			return [
				{
					isPrize: prizeIndex === 0,
					selected: false,
					shown: false,
				},
				{
					isPrize: prizeIndex === 1,
					selected: false,
					shown: false,
				},
				{
					isPrize: prizeIndex === 2,
					selected: false,
					shown: false,
				},
			];
		}
	};
}

type DoorState = {
	isPrize: boolean;
	selected: boolean;
	shown: boolean;
};
function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

//**
// 0 + 0 = 1
// 0 + 1 = 2
// 1 + 0 = 0
// 1 + 1 = 2
// 2 + 0 = 0
// 2 + 1 = 1
