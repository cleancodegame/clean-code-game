import React from 'react';
import AppPage from './AppPage';
import GameView from './GameView';
import ProgressBar from './View/ProgressBar';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function App({game, onStartGame, auth}) {
    return (
        <AppPage tallHeader={game.state === 'HOME'} userName={auth.userName}>
            <ProgressBar max={game.levelsCount} completed={game.currentLevelIndex} />
            <GameView onStartGame={onStartGame} auth={auth} game={game}/>
        </AppPage>
    );
}

export default App;
