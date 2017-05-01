import React from 'react';
import AppPage from './AppPage';
import GameView from './GameView';
import ProgressBar from './View/ProgressBar';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function App({game, onStartGame, auth, user}) {
    return (
        <AppPage tallHeader={user.state === 'HOME'} userName={auth.userName}>
            <ProgressBar max={game.levelsCount} completed={game.currentLevelIndex} />
            <GameView onStartGame={onStartGame} auth={auth} game={game} user={user}/>
        </AppPage>
    );
}

export default App;
