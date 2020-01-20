class SaperField {
	constructor(x, y, gameController) {
		this.condition = 0;
		this.gameController = gameController;
		this.x = x;
		this.y = y;
		this.mine = false;
		this.mineCounter = 0;
		this.blockNode = false;
		this.createNode();
	}

	// mine
	hasMine() {
		return this.mine;
	}

	setMine() {
		this.mine = true;
	}

	showMine() {
		this.node.dataset['hasMine'] = true;
		this.node.textContent = '*';
	}

	// counter
	increaseMineCounter() {
		this.mineCounter += 1;
	}

	// node
	createNode() {
		this.node = document.createElement('div');
		this.node.className = 'game-play__board-field';
		this.node.dataset['x'] = this.x;
		this.node.dataset['y'] = this.y;
		this.node.dataset['discovered'] = false;
		this.node.dataset['hasMine'] = false;

		this.node.addEventListener('click', (e) => this.handleLeftClick(e) );
		this.node.addEventListener( 'contextmenu', (e) => this.handleRightClick(e) );
	}

	getNode() {
		return this.node;
	}

	isBlockNode() {
		return this.blockNode;
	}

	setNodeBlock() {
		this.blockNode = true;
	}

	deselect() {
		this.node.textContent = '';
		this.condition = 0;
		this.gameController.deselectField(this.x, this.y);
	}

	select() {
		this.node.textContent = '*';
		this.condition = 1;
		this.gameController.selectField(this.x, this.y);
	}

	isSelected() {
		return this.condition === 1;
	}

	discover(showMine = false) {
		if ( this.condition === 2 ) return  false;
		if ( this.hasMine() ) {
			this.gameController.gameOver();
			return false;
		}

		if ( this.condition === 1 ) this.deselect();

		this.condition = 2;
		this.node.textContent = this.mineCounter === 0 ? '' : this.mineCounter;
		this.node.dataset['discovered'] = true;
		this.gameController.discoverField(this.x, this.y, this.mineCounter);
	}

	handleLeftClick(e){
		e.preventDefault();
		if( this.isBlockNode() ) return false;
		if ( this.condition === 2 )
			this.gameController.shiftDiscover(this.x, this.y);
		else
			this.discover();
	}

	handleRightClick(e) {
		e.preventDefault();
		if( this.isBlockNode() )
			return false;

		if( this.condition === 0 )
			this.select();
		else if( this.condition === 1)
			this.deselect();
	}
}