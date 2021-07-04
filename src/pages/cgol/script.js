import play from "./cgol.js";

const grid = document.querySelector(".grid");
const start = document.querySelector(".options > .start");
const crazyD = document.querySelector("#crazy");

const vars = {
	mp: [], // multidimensional array
	stopped: true,
	crazy: crazyD.checked
};

(() => {
	let num = 0;

	// y and x vars. Make sure css --board-dim is Math.max(maxX, maxY) from this loop
	const maxY = 50;
	const maxX = 75
	for (let y = 0; y < maxY; y++) {
		vars.mp.push([]);
		for (let x = 0; x < maxX; x++) {
			vars.mp[y].push(false);
			const cell = document.createElement("div");
			cell.className = "gridcell";
			cell.dataset.num = num;
			cell.dataset.x = x;
			cell.dataset.y = y;
			cell.addEventListener("click", () => {
				cell.classList.toggle("alive-cell");
				vars.mp[y][x] = !vars.mp[y][x];
			});
			grid.appendChild(cell);
			num++;
		}
	}
})();

start.addEventListener("click", () => {
	vars.stopped = !vars.stopped;
	play(vars);
});

crazyD.addEventListener("click", () => {
	vars.crazy = !vars.crazy;
});