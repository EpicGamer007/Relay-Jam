// Worker. e.data is the vars. What matters here is doing the calculations to get which ones to change. then we return that which cgol.js then changes in the actual screen.

// Calculates the grid for the next generation given the current generation's grid
const calcNextGen = (grid, crazy) => {
	// 50 (height) x 75 (length)
	let map = [];
	for (let y = 0; y < grid.length; y++) {
		map.push([]);
		for (let x = 0; x < grid[y].length; x++) {
			let aliveNeighbors = 0;
			// Check all sides of each alive cell for alive neighbors
			// ============
			// TOP
			if (y > 0) {
				if (grid[y-1][x] === true) aliveNeighbors++;
			}
			// TOP Left
			if (y > 0 && x > 0) {
				if (grid[y-1][x-1] === true) aliveNeighbors++;
			}
			// TOP Right
			if (y > 0 && x < (grid[y].length-1)) {
				if (grid[y-1][x+1] === true) aliveNeighbors++;
			}
			// Bottom
			if (y < (grid.length-1)) {
				if (grid[y+1][x] === true) aliveNeighbors++;
			}
			// Bottom Left
			if (y < (grid.length-1) && x > 0) {
				if (grid[y+1][x-1] === true) aliveNeighbors++;
			}
			// Bottom right
			if (y < (grid.length-1) && x < (grid[y].length-1)) {
				if (grid[y+1][x+1] === true) aliveNeighbors++;
			}
			// Left
			if (x > 0) {
				if (grid[y][x-1] === true) aliveNeighbors++;
			}
			// Right
			if (x < (grid[y].length-1)) {
				if (grid[y][x+1] === true) aliveNeighbors++;
			}

			if(crazy) {
				map[y].push(aliveNeighbors === 2 || aliveNeighbors === 3);
			} else {
				if(grid[y][x] === false) {
					map[y].push(aliveNeighbors === 3);
				} else {
					map[y].push(aliveNeighbors === 2 || aliveNeighbors === 3);
				}
			}
		}
	}

	return map;
}

onmessage = (e) => {
	const gr = calcNextGen(e.data.mp, e.data.crazy);
	postMessage(gr);
}