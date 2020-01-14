class SaperField {
	constructor(hasMine, mineCounter){
		this.conditions = ['uncovered', 'suspected', 'discovered']
		this.condition = ['uncovered'];

		this.hasMine = hasMine;
		this.mineCounter = mineCounter;
	}

	discover() {
		if ( this.hasMine )
			return false;

		return this.mineCounter;
	}

	suspect() {
		this.condition = 'suspected';
	}
}