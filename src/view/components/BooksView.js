import React from 'react';
import cleancode from '../../img/cleancode.jpg'
import codecomplete from '../../img/codecomplete.jpg'
import cat from '../../img/cat.png'

const books = [
	{
		title: 'Чистый код. Роберт Мартин',
		img: cleancode,
		url: 'http://www.ozon.ru/context/detail/id/21916535/'
	},
	{
		title: 'Совершенный код. Стив Макконнелл',
		img: codecomplete,
		url: 'http://www.ozon.ru/context/detail/id/3159814/'
	}
];

function Book({title, url, img}) {
	return <a
		className="book"
		target="blank"
		title={title}
		href={url}><img src={img} alt={title} /></a>
}

function BooksView() {
	return (
		<div>
			<p>
				Далеко не все аспекты чистого кода можно раскрыть в такой короткой и простой игре.
			Больше и подробнее можно узнать из этих замечательных книг:</p>
			<div className="books pull-left">
				{books.map(b => <Book key={b.title} {...b} />)}
				<img className="book" src={cat} width="250" alt="Чистый кот" />
			</div>
			<div className="clearfix" />
		</div>
	);
}

export default BooksView;
