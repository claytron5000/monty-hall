import { useState } from "react";
import "./App.css";

type DoorState = {
	hasPrize: boolean;
	isChosen: boolean;
	isOpen: boolean;
};
const initialDoors = [
	{ hasPrize: true, isChosen: false, isOpen: false },
	{ hasPrize: false, isChosen: false, isOpen: false },
	{ hasPrize: false, isChosen: false, isOpen: false },
];

function resetDoors(doors: DoorState[]) {
	return doors.map((d) => ({
		isChosen: false,
		isOpen: false,
		hasPrize: d.hasPrize,
	}));
}

function App() {
	const [doors, setDoors] = useState<DoorState[]>(
		knuthShuffle([...initialDoors])
	);
	const [wins, setWins] = useState(0);
	const [losses, setLosses] = useState(0);

	function revealDoor() {
		if (!doors.find((d) => d.isChosen)) {
			//noop, if no are chosen we shouldn't be firing this function
		} else {
			const acc: number[] = [];
			const unchosenIndexes = doors.reduce((acc, d, index) => {
				if (d.isChosen) {
					return acc;
				}
				return acc.concat([index]);
			}, acc);
			const rand = randomInt(2);
			let revealIndex = unchosenIndexes[rand];
			if (doors[revealIndex].hasPrize) {
				//reveal the other one
				revealIndex = unchosenIndexes[rand === 1 ? 0 : 1];
				doors[revealIndex].isOpen = true;
				setDoors([...doors]);
			} else {
				doors[revealIndex].isOpen = true;
				setDoors([...doors]);
			}
		}
	}
	function callBack(index: number) {
		// nothing chosen yet: first choice
		if (!doors.find((d) => d.isChosen)) {
			doors[index].isChosen = true;
			setDoors([...doors]);
			revealDoor();
		}
		// if the prize door is open, this is end of game and do nothing
		else if (doors.find((d) => d.isOpen && d.hasPrize)) {
			console.log("click reset to start over");
		} else {
			// reveal all doors
			doors.forEach((d) => {
				d.isOpen = true;
				d.isChosen = false;
			});
			// reset chosen door
			doors[index].isChosen = true;
			setDoors([...doors]);
			if (doors[index].hasPrize) {
				setWins(wins + 1);
			} else {
				setLosses(losses + 1);
			}
		}
	}

	return (
		<>
			<header>
				<p>
					The{" "}
					<a href="https://en.wikipedia.org/wiki/Monty_Hall_problem">
						Monty Hall Problem
					</a>
					. Behind one of these doors is a new car. Choose a door. Once you've
					chosen a door, Monty will reveal a <b>goat</b> from one of the
					remaining two doors. The question for you is: keep your selected door,
					or chosen the door he didn't reveal? (Hint, there is a correct answer,
					and your instincts are probably wrong!)
				</p>
			</header>
			<br />
			<div className="doorPanel">
				{doors.map(({ hasPrize, isChosen, isOpen }, index) => (
					<button onClick={() => callBack(index)}>
						<Door
							key={index}
							hasPrize={hasPrize}
							isChosen={isChosen}
							isOpen={isOpen}
						/>
					</button>
				))}
			</div>
			<br />
			<button
				onClick={() => {
					console.log(initialDoors);
					setDoors(resetDoors(knuthShuffle(initialDoors)));
				}}
			>
				reset game
			</button>
			{wins > 0 && <p>wins: {Array.from({ length: wins }).map(() => "✔")}</p>}
			{losses > 0 && (
				<p>losses: {Array.from({ length: losses }).map(() => "✗")}</p>
			)}
		</>
	);
}

export default App;

function Door({ hasPrize, isChosen, isOpen }: DoorState) {
	if (!isOpen && !isChosen) {
		return <div className="door closed">closed door</div>;
	}
	if (!isOpen && isChosen) {
		return <div className="door closed selected">selected door</div>;
	}
	if (isOpen && hasPrize && isChosen) {
		return <div className="door prize won selected">you won a new car!</div>;
	}
	if (isOpen && hasPrize && !isChosen) {
		return <div className="door prize">a new car</div>;
	}
	if (isOpen && !hasPrize && !isChosen) {
		return <div className="door goat">goat</div>;
	}
	if (isOpen && !hasPrize && isChosen) {
		return (
			<div className="door goat won selected">you won a goat, I guess</div>
		);
	}
}

function knuthShuffle(array: DoorState[]) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		const randomIndex = randomInt(currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
	return array;
}

function randomInt(max: number) {
	return Math.floor(Math.random() * max);
}
