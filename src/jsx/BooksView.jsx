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
				<div className="books">
				{_(this.books).map(function(b){
					return <div className="book pull-left" key={b.title}>
						<a target="blank" title={b.title} href={b.url}><img src={b.img} alt={b.title}/></a>
					</div>
				})}
					<div className="clearfix"/>
				</div>
			</div>
			);
	}
});

module.exports = BooksView;