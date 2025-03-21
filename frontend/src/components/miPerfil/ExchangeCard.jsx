import "../../styles/miPerfil/ExchangeCard.css"

const ExchangeCard = ({ leftBook, rightBook, arrow }) => {
  return (
    <div className="book-exchange">
      <h2 className="exchange-title">Historial de intercambios</h2>
      <div className="image-container">
        <img src={leftBook} alt="Libro Entregado" className="book-image"></img>
        <img src={arrow} alt="Intercambio" className="arrow-image"></img>
        <img src={rightBook} alt="Libro Recibido" className="book-image"></img>
      </div>
    </div>
  );
};

export default ExchangeCard;