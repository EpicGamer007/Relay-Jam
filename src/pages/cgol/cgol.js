const player = new Worker("runworker.js");

// Handle any incoming data from the Worker instance
player.onmessage = (resp) => {
	let newGrid = resp.data;
	for (let y = 0; y < newGrid.length; y++) {
		for (let x = 0; x < newGrid[y].length; x++) {
			let cell = grid.querySelector(`[data-x=\"${x}\"][data-y=\"${y}\"]`);
			if (cell.classList.contains("alive-cell") != newGrid[y][x])
				cell.classList.toggle("alive-cell");
		}
	}
	document.dispatchEvent(
		new CustomEvent(
			"bleh", {
				"detail": {
					"mp": newGrid
				}
			}
		)
	);
}

// We will use setInterval (as seen below). We can add a "ticks" to the vars which is connected to a slider to change the speed.
let interval = undefined;

const grid = document.querySelector(".grid");
const start = document.querySelector(".options > .start");

export default (vars) => {
	if (vars.stopped) {
		start.innerText = "Start";
		if(interval && typeof interval === "number") {
			clearInterval(interval);
		}
	} else {
		start.innerText = "Stop";
		interval = setInterval(() => {
			player.postMessage(vars);
		}, 100);
	}

	document.addEventListener("bleh", (e) => {
		vars.mp = e.detail.mp;
	});
}