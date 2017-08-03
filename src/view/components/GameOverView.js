import React from 'react';
import BooksView from "./BooksView";

function GameOverView({handlePlayAgain}){
	return <div>
		<h2>Вы проиграли!</h2>
		<p>
			Это была плохая новость.
			Хорошая новость — вам есть куда расти!
		</p>
		<BooksView />

		<p>
			Впрочем, возможно, вам просто не повезло. Попробуйте ещё раз!
		</p>

		<button className="btn btn-lg btn-primary btn-styled" onClick={handlePlayAgain}>Ещё раз</button>
	</div>;
}


export default GameOverView;
