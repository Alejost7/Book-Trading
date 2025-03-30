import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/tradeLibros/exchangeDetails.css';

const ExchangeDetails = ({ exchange, onClose, userId }) => {
    const [details, setDetails] = useState({
        requesterAddress: '',
        requesterPhone: '',
        requesterEmail: '',
        ownerAddress: '',
        ownerPhone: '',
        ownerEmail: '',
        meetingPoint: '',
        meetingDate: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/exchanges/${exchange._id}/details`, details);
            setSuccess('Detalles del intercambio actualizados exitosamente');
            setError('');
            // Cerrar el modal después de 2 segundos
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al actualizar los detalles');
            setSuccess('');
        }
    };

    const handleConfirmDelivery = async (bookId) => {
        try {
            await axios.patch(`http://localhost:5000/exchanges/${exchange._id}/confirm-delivery`, {
                confirmedBy: userId,
                bookId: bookId
            });
            setSuccess('Entrega confirmada exitosamente');
            setError('');
            // Cerrar el modal después de 2 segundos
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al confirmar la entrega');
            setSuccess('');
        }
    };

    return (
        <div className="exchange-details-modal">
            <div className="exchange-details-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Detalles del Intercambio</h2>
                
                <div className="exchange-books">
                    <div className="book-info">
                        <h3>Libro Solicitado</h3>
                        <img src={exchange.requestedBook.image} alt={exchange.requestedBook.title} />
                        <p>{exchange.requestedBook.title}</p>
                    </div>
                    <div className="book-info">
                        <h3>Libro Ofrecido</h3>
                        <img src={exchange.offeredBook.image} alt={exchange.offeredBook.title} />
                        <p>{exchange.offeredBook.title}</p>
                    </div>
                </div>

                {exchange.status === "aceptado" && (
                    <>
                        <h3>Detalles de Entrega</h3>
                        {exchange.isRequester ? (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <h4>Tu Información de Contacto</h4>
                                    <input
                                        type="text"
                                        placeholder="Tu dirección"
                                        value={details.requesterAddress}
                                        onChange={(e) => setDetails({...details, requesterAddress: e.target.value})}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Tu teléfono"
                                        value={details.requesterPhone}
                                        onChange={(e) => setDetails({...details, requesterPhone: e.target.value})}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Tu email"
                                        value={details.requesterEmail}
                                        onChange={(e) => setDetails({...details, requesterEmail: e.target.value})}
                                    />
                                </div>

                                <div className="form-group">
                                    <h4>Información del Propietario</h4>
                                    <input
                                        type="text"
                                        placeholder="Dirección del propietario"
                                        value={details.ownerAddress}
                                        onChange={(e) => setDetails({...details, ownerAddress: e.target.value})}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Teléfono del propietario"
                                        value={details.ownerPhone}
                                        onChange={(e) => setDetails({...details, ownerPhone: e.target.value})}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email del propietario"
                                        value={details.ownerEmail}
                                        onChange={(e) => setDetails({...details, ownerEmail: e.target.value})}
                                    />
                                </div>

                                <div className="form-group">
                                    <h4>Detalles del Encuentro</h4>
                                    <input
                                        type="text"
                                        placeholder="Punto de encuentro"
                                        value={details.meetingPoint}
                                        onChange={(e) => setDetails({...details, meetingPoint: e.target.value})}
                                    />
                                    <input
                                        type="datetime-local"
                                        value={details.meetingDate}
                                        onChange={(e) => setDetails({...details, meetingDate: e.target.value})}
                                    />
                                </div>

                                <button type="submit" className="submit-btn">
                                    Actualizar Detalles
                                </button>
                            </form>
                        ) : (
                            <div className="delivery-details">
                                {exchange.exchangeDetails ? (
                                    <>
                                        <div className="contact-info">
                                            <h4>Información de Contacto del Solicitante</h4>
                                            <p><strong>Dirección:</strong> {exchange.exchangeDetails.requesterAddress}</p>
                                            <p><strong>Teléfono:</strong> {exchange.exchangeDetails.requesterPhone}</p>
                                            <p><strong>Email:</strong> {exchange.exchangeDetails.requesterEmail}</p>
                                        </div>

                                        <div className="meeting-info">
                                            <h4>Detalles del Encuentro</h4>
                                            <p><strong>Punto de encuentro:</strong> {exchange.exchangeDetails.meetingPoint}</p>
                                            <p><strong>Fecha y hora:</strong> {new Date(exchange.exchangeDetails.meetingDate).toLocaleString()}</p>
                                        </div>

                                        <div className="delivery-actions">
                                            <button 
                                                onClick={() => handleConfirmDelivery(exchange.requestedBook._id)}
                                                className="confirm-delivery-btn"
                                            >
                                                Confirmar Entrega
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="waiting-message">
                                        El solicitante aún no ha proporcionado los detalles de entrega. 
                                        Por favor, espera a que actualice la información.
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}

                {exchange.status === "meetup_scheduled" && (
                    <div className="meetup-details">
                        <h3>Detalles del Encuentro</h3>
                        <div className="contact-info">
                            <h4>Información de Contacto</h4>
                            <p><strong>Punto de encuentro:</strong> {exchange.exchangeDetails.meetingPoint}</p>
                            <p><strong>Fecha y hora:</strong> {new Date(exchange.exchangeDetails.meetingDate).toLocaleString()}</p>
                        </div>

                        <div className="delivery-actions">
                            <button 
                                onClick={() => handleConfirmDelivery(exchange.requestedBook._id)}
                                className="confirm-delivery-btn"
                            >
                                Confirmar Entrega
                            </button>
                        </div>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
        </div>
    );
};

export default ExchangeDetails; 