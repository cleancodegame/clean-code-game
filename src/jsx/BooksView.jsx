var BooksView = React.createClass({
	books: [
		{
			title: 'Чистый код. Роберт Мартин',
			img: 'img/cleancode.jpg',
			url: 'http://www.ozon.ru/context/detail/id/21916535/'
		},
		{
			title: 'Совершенный код. Стив Макконнелл',
			img: 'img/codecomplete.jpg',
			url: 'http://www.ozon.ru/context/detail/id/3159814/'
		}
	],
	render: function() {
		return (
			<div>
				<p>Больше и подробнее про чистый код можно узнать из этих замечательных книг:</p>
				<div className="books pull-left">
					{_(this.books).map(function(b){
						return <a className="book" key={b.title} target="blank" 
								title={b.title} href={b.url}><img src={b.img} alt={b.title}/></a>
					})}
					<img className="book" src="img/cat.png" width="250" alt="Чистый кот" />
				</div>
				<div className="clearfix"/>
			</div>
			);
	}
});

module.exports = BooksView;