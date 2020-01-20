class SaperGraphicController {
    constructor(gameController) {
        this.rootNode =  document.querySelector('.game-play__board');
        this.nodeHeader = this.rootNode.querySelector('.game-play__board-header');
        this.nodeContent = this.rootNode.querySelector('.game-play__board-content');
        this.nodeFooter = this.rootNode.querySelector('.game-play__board-footer');

        this.timer = new saperTimer(this.rootNode.querySelector('.game-play__board-timer'));
        this.counterNode = this.rootNode.querySelector('.game-play__board-counter');
        this.gameController = gameController;
    }

    displayBoard() {
        this.nodeContent.innerHTML = '';
        this.nodeFooter.innerHTML = '';
        this.nodeContent.style.height = `${25 * this.gameController.sizeY}px`;
        this.rootNode.style.width = `${25 * this.gameController.sizeX}px`;

        this.gameController.boardMap.forEach( (boardRow) => boardRow.forEach( (field) => {
                this.nodeContent.appendChild(field.getNode());
            })
        );

        this.updateCounter(this.gameController.mines);
        this.timer.start();
    }

    displayEndGame(text) {
        this.nodeFooter.innerHTML = text;
    }

    updateCounter(value) {
        this.counterNode.textContent = value;
    }

    stop() {
        this.timer.stop();
        return this.timer.getEndTime();
    }
}

class saperTimer {
    constructor(node) {
        this.node = node;
        this.interval = null;
        this.timeStart = null;
        this.timeEnd = null;
    }

    start() {
        this.reset();
        this.timeStart = Date.now();
        this.interval = setInterval( () => {
            this.timeEnd = Math.floor( (Date.now() - this.timeStart) / 1000);
            this.refresh();
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

    reset() {
        this.stop();
        this.timeEnd = 0;
        this.refresh();
    }

    refresh() {
        this.node.textContent = this.timeEnd;
    }

    getEndTime() {
        return this.timeEnd;
    }
}