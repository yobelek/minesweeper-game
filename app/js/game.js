const gameForm = document.querySelector('.game-play__form');
const settingKeys = ['sizeX', 'sizeY', 'mines'];
const gameSettings = settingKeys.reduce( (tempSettings, setting) => {
    const node = gameForm.querySelector(`.game-play__setting[data-setting="${setting}"] input`);
    tempSettings[setting] = {
        node,
        value: node.value
    };
    return tempSettings;
}, {});

let game = new SaperGameController();

function saveSettingValue(settingKey) {
    const settingNode = gameSettings[settingKey].node;
    gameSettings[settingKey].value = settingNode.value;
    
    settingNode.previousElementSibling.textContent = settingNode.value;
    if( ['sizeX', 'sizeY'].includes(settingKey) ) updateMinesSetting();
}

function updateMinesSetting() {
    const newMaxMines = Math.floor(gameSettings['sizeX'].value * gameSettings['sizeY'].value / 3);
    const currentMinesValue = gameSettings['mines'].value;

    if ( currentMinesValue > newMaxMines ) {
        gameSettings['mines'].node.setAttribute( 'value', newMaxMines);
        gameSettings['mines'].value = newMaxMines;
    }
    gameSettings['mines'].node.setAttribute('max', newMaxMines );
    saveSettingValue('mines');
}

function initNewGame(e) {
    e.preventDefault();
    game.newGame(gameSettings['sizeX'].value, gameSettings['sizeY'].value, gameSettings['mines'].value);
}

settingKeys.forEach( (settingKey) => {
    gameSettings[settingKey].node.addEventListener('input', () => saveSettingValue(settingKey))
});

gameForm.addEventListener('submit', initNewGame);

