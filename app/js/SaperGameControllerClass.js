class SaperGameController {
	constructor(sizeX, sizeY, mines){
		this.sizeX = null;
		this.sizeY = null;
		this.mines = null;
		this.minesList = null;
		this.saveFields = null;
		this.discoveredFields = 0;
		this.selectedFields = 0;
		this.gameTime = 0;
		this.graphicController = new SaperGraphicController(this);

		// shift key
		this.isShiftKeyDown = false;
		this.shiftKeyStatusOn = (e) => {
			if ( e.shiftKey ) {
				this.isShiftKeyDown = true;
				window.addEventListener( 'keyup', this.shiftKeyStatusOff);
				window.removeEventListener('keydown', this.shiftKeyStatusOn);
			}
		};

		this.shiftKeyStatusOff = (e) => {
			if ( !e.shiftKey ) {
				this.isShiftKeyDown = false;
				window.addEventListener( 'keydown', this.shiftKeyStatusOn);
				window.removeEventListener('keyup', this.shiftKeyStatusOff);
			}
		}

		window.addEventListener( 'keydown', this.shiftKeyStatusOn);
	}

	newGame(sizeX, sizeY, mines) {
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.mines = mines;
		this.saveFields = this.sizeX * this.sizeY - this.mines;
		this.discoveredFields = 0;
		this.selectedFields = 0;
		this.createBoardMap();
	}

	getAdjacentFieldsIndexes(x, y) {
		const adjecentFields = [];
		let indexX, indexY;

		[-1, 0, 1].forEach( (i) => {
			[-1, 0, 1].forEach( (j) => {
				indexX = x + i;
				indexY = y + j;
				if( 0 <= indexX && indexX < this.sizeX
					&& 0 <= indexY && indexY < this.sizeY
					&& !(i === 0 && j === 0) )
					adjecentFields.push({
						x: indexX,
						y: indexY,
					})
			})
		})

		return adjecentFields;
	}

	// Create Board

	createBoardMap() {
		this.initBoardMap();
		this.setMines();
		this.setBoardCounters();
		this.graphicController.displayBoard();
	}

	initBoardMap() {
		this.boardMap =  Array.from({length: this.sizeX} ).map( (row, x) => {
			return Array.from({length: this.sizeY}).map( (field, y) => {
				return new SaperField(x, y, this)
			})
		});
	}

	setMines() {
		this.minesList = [];
		let minesCounter = 0;
		let x, y;
		while( minesCounter < this.mines ) {
			x = Math.floor(Math.random() * this.sizeX );
			y = Math.floor(Math.random() * this.sizeY );
			if( !this.boardMap[x][y].hasMine() ) {
				this.boardMap[x][y].setMine();
				this.minesList.push( {x, y} );
				minesCounter++;
			}
		}
	}

	setBoardCounters() {
		this.minesList.forEach( (index) => this.increaseAdjacentCounters(index.x, index.y) )
	}

	increaseAdjacentCounters(x, y) {
		this.getAdjacentFieldsIndexes(x, y)
			.filter( (index) => !this.boardMap[index.x][index.y].hasMine() )
			.forEach( (index) => this.boardMap[index.x][index.y].increaseMineCounter() )
	}

	// right click

	deselectField(x, y) {
		this.selectedFields -= 1;
		this.graphicController.updateCounter(this.mines - this.selectedFields);
	}

	selectField(x, y) {
		this.selectedFields += 1;
		this.graphicController.updateCounter(this.mines - this.selectedFields);
	}

	// left click

	discoverField(x,y, mineCounter) {
		this.discoveredFields += 1;
		if( this.discoveredFields === this.saveFields )
			this.winGame();
		else if( mineCounter === 0 )
			this.discoverAdjacentFields(x, y);
	}

	shiftDiscover(x, y) {
		if ( !this.isShiftKeyDown ) return false;

		this.getAdjacentFieldsIndexes(x, y)
			.filter( (index) => !this.boardMap[index.x][index.y].isSelected() )
			.forEach( (index) => this.boardMap[index.x][index.y].discover() )
	}

	discoverAdjacentFields(x, y) {
		this.getAdjacentFieldsIndexes(x, y).forEach( (index) => this.boardMap[index.x][index.y].discover() )
	}

	// End Game

	blockMap() {
		this.boardMap.forEach( boardRow => boardRow.forEach( field => field.setNodeBlock() ))
	}

	discoverMines() {
		this.minesList.forEach( (index) => this.boardMap[index.x][index.y].showMine() )
	}

	winGame() {
		this.blockMap();
		this.gameTime = this.graphicController.stop();
		this.graphicController.displayEndGame('You win!')
	}

	gameOver() {
		this.blockMap();
		this.discoverMines();
		this.graphicController.stop();
		this.graphicController.displayEndGame('You lose!')
	}
}