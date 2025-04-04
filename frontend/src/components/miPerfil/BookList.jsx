import "../../styles/miPerfil/BookList.css";

const BookList = ({ books }) => {
    return (
        <div className="BookListContainer">
            <h2 className="BookListTitle">Mis Libros</h2>
            <div className="BookList">
                {books.map((book, index) => (
                    <div key={index} className="BookCard">
                        <img src={book.image} alt={book.name} className="BookImage" />
                        <h3 className="BookTitle">{book.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default BookList