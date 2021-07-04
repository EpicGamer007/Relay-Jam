import kaboom from "https://kaboomjs.com/lib/0.5.1/kaboom.mjs";

const k = kaboom({
	clearColor: [0, 0, 0, 0],
	width: 360,
	height: 720,
	debug: true
});

k.scene("menu", () => {

	k.add([
		k.text("TETRIS", k.width() / 8),
		k.pos(k.width() / 8, 100)
	]);

	k.add([
		k.text("Press p to play", k.width() / 17),
		k.pos(k.width() / 17, 200),
		k.color(0, 0, 1)
	]);

	k.add([
		k.text("Press h to learn", k.width() / 17),
		k.pos(k.width() / 17, 260),
		k.color(0, 0, 1)
	]);

	k.add([
		k.text("Press q to quit", k.width() / 17),
		k.pos(k.width() / 17, 320),
		k.color(1, 0, 0)
	]);

	k.keyPress("p", () => {
		k.go("game");
	});

	k.keyPress("h", () => {
		window.open("https://tetris.fandom.com/");
	});

	k.keyPress("q", () => {
		window.close();
	});

});

k.scene("game", () => {

	k.layers([
		"game", // Actual game layer
		"ui", // score and next tetronimo comes up here
	], "game");

	let score = 0;
	let bWidth = 10;
	let bHeight = 20;
	let board = [...Array(bHeight)].map(e => Array(bWidth));
	let timer = 0;
	let tetrominos = [
		[
			[1, 1, 1, 1]
		],
		[
			[1, 0, 0],
			[1, 1, 1]
		],
		[
			[0, 0, 1],
			[1, 1, 1]
		],
		[
			[0, 1, 0],
			[1, 1, 1]
		],
		[
			[1, 1],
			[1, 1]
		],
		[
			[1, 1, 0],
			[0, 1, 1]
		],
		[
			[0, 1, 1],
			[1, 1, 0]
		],
	];

	const chooseTetromino = () => {return [...tetrominos[Math.floor(Math.random() * 7)]];}
	let curTetromino = chooseTetromino();
	const nextTetromino = () => {
		for (var y = 0; y < curTetromino.length; y++) {
			for (var x = 0; x < curTetromino[y].length; x++) {
				if (curTetromino[y][x] > 0) {
					board[y][x] = curTetromino[y][x];
				}
			}
		}
		curTetromino = chooseTetromino();
		// TODO Cause a game over if a collision is detected here.
	}

	let scoreText = k.add([
		k.text(`Score ${score}`),
		k.pos(20, 20),
		k.layer("ui"),
	]);

	const updateScore = () => {
		score += 10;
		k.destroy(scoreText);
		scoreText = k.add([
			k.text(`Score ${score}`),
			k.pos(20, 20),
			k.layer("ui"),
		]);
	}

	const drawBoard = () => {
		for (var y = 0; y < bHeight; y++) {
			for (var x = 0; x < bWidth; x++) {
				if (board[y][x] > 0) {
					k.drawRect(
						k.vec2(x * (360 / bWidth), y * (720 / bHeight)),
						360 / bWidth,
						720 / bHeight,
						{
							color: k.rgba(0, 1, 0, 1)
						}
					);
				}
			}
		}

		for (var y = 0; y < curTetromino.length; y++) {
			for (var x = 0; x < curTetromino[y].length; x++) {
				if (curTetromino[y][x] > 0) {
					k.drawRect(
						k.vec2(x * (360 / bWidth), y * (720 / bHeight)),
						360 / bWidth,
						720 / bHeight,
						{
							color: k.rgba(1, 0, 1, 1)
						}
					);
				}
			}
		}
	}

	const drawGrid = () => {
		for (var y = 1; y < bHeight; y++) {
			k.drawLine(
				k.vec2(0, y * (720 / bHeight)),
				k.vec2(360, y * (720 / bHeight)),
				{
					color: k.rgba(1, 1, 1, 0.1)
				}
			);
		}
		for (var x = 1; x < bWidth; x++) {
			k.drawLine(
				k.vec2(x * (360 / bWidth), 0),
				k.vec2(x * (360 / bWidth), 720),
				{
					color: k.rgba(1, 1, 1, 0.1)
				}
			);
		}
	}

	const checkCollision = () => {
		for (var y = 0; y < curTetromino.length; y++) {
			for (var x = 0; x < curTetromino[y].length; x++) {
				if (curTetromino[y][x] > 0 && board[y + 1][x] > 0) return true;
			}
		}
		return false;
	}

  const checkCompleteLine = () => {
    for (let y = 0; y < board.length; y++) {
      let num = 0;
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] === 1) {
          num++;
        }
      }
      if (num === 10) {
        console.log("run")
        board.splice(y, 1);
        board.unshift([])
		updateScore();
      }
      num = 0;
    }
  }

	function shiftRight() {
		if (curTetromino[curTetromino.length - 1].length == 10) return;
		curTetromino.forEach(function(v){
			v.unshift([]);
		})
	}

	function shiftLeft() {
		let doRet = false;
		curTetromino.forEach(function(v){
			if (v[0] > 0) doRet = true;
		})
		if (doRet) return;
		
		curTetromino.forEach(function(v){
			v.shift();
		})
	}

	function shiftDown() {
		curTetromino.unshift([]);
	}

	/* k.keyPress("space", () => {
		updateScore();
	}); */

	k.keyPress("q", () => {
		k.go("score", score);
	});

	k.keyPress("a", shiftLeft);
	k.keyPress("d", shiftRight);

	k.render(() => {
		drawGrid();
		drawBoard();
		timer++;
		if (timer >= 8) {
			timer = 0;
			if (curTetromino.length == 20 || checkCollision()) {
				nextTetromino();
        checkCompleteLine();

			} else {
				shiftDown();
			}
		}
	});
});

k.scene("score", (score) => {
	k.add([
		k.text(`Score: ${score}`, 30),
		k.pos(10, 100)
	]);

	k.add([
		k.text("Press p to play again", k.width() / 24),
		k.pos(k.width() / 24, 200),
		k.color(0, 0, 1)
	]);

	k.add([
		k.text("Press m to go to menu", k.width() / 24),
		k.pos(k.width() / 24, 260),
		k.color(0, 0, 1)
	]);

	k.keyPress("p", () => {
		k.go("game");
	});

	k.keyPress("m", () => {
		k.go("menu")
	});
});

k.start("menu");