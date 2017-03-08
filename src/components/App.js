import React from 'react';
import AppPage from './AppPage';
import GameView from './GameView';
import ProgressBar from './View/ProgressBar';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function App({game, onStartGame}) {
    return (
        <AppPage tallHeader={game.state === 'HOME'} userName={game.userName}>
            <ProgressBar max={game.levelsCount} completed={game.currentLevelIndex} />
            <GameView onStartGame={onStartGame} game={game} />
        </AppPage>
    );
}

export default App;
