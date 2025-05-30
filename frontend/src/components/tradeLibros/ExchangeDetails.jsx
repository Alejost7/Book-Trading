import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/tradeLibros/exchangeDetails.css';
const API_URL = import.meta.env.VITE_API_URL;


const ExchangeDetails = ({ exchange, onClose, userId, onExchangeUpdated }) => {
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

    // Función para validar que todos los campos estén llenos
    const isFormValid = () => {
        return Object.values(details).every(value => value.trim() !== '');
    };

    // Función para verificar si los detalles ya están actualizados
    const areDetailsUpdated = () => {
        return exchange.exchangeDetails && 
            exchange.exchangeDetails.meetingPoint && 
            exchange.exchangeDetails.meetingDate;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid()) {
            setError('Por favor, completa todos los campos del formulario');
            return;
        }

        try {
            await axios.post(`${API_URL}/exchanges/exchan/${exchange._id}/details`, { 
                ...details, 
                userId: userId
            });
            
            setSuccess('Detalles del intercambio actualizados exitosamente');
            setError('');
            // Actualizamos el intercambio en el componente padre
            if (onExchangeUpdated) {
                const updatedExchange = {
                    ...exchange,
                    exchangeDetails: details,
                    status: "meetup_scheduled"
                };
                onExchangeUpdated(updatedExchange);
            }
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
            const response = await axios.patch(`${API_URL}/exchanges/${exchange._id}/confirm-delivery`, {
                confirmedBy: userId,
                bookId: bookId
            });

            // Verificar si el intercambio se completó
            if (response.data.exchange.status === "completado") {
                setSuccess('¡Intercambio completado exitosamente! Los libros han cambiado de propietario.');
            } else {
                setSuccess('Entrega confirmada. Esperando la confirmación de la otra parte.');
            }
            
            setError('');
            
            // Actualizar el estado local del intercambio
            if (response.data.exchange) {
                // Aquí podrías actualizar el estado del intercambio en el componente padre
                // si es necesario, usando un callback
                onExchangeUpdated?.(response.data.exchange);
            }

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
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Tu teléfono"
                                        value={details.requesterPhone}
                                        onChange={(e) => setDetails({...details, requesterPhone: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Tu email"
                                        value={details.requesterEmail}
                                        onChange={(e) => setDetails({...details, requesterEmail: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <h4>Información del Propietario</h4>
                                    <input
                                        type="text"
                                        placeholder="Dirección del propietario"
                                        value={details.ownerAddress}
                                        onChange={(e) => setDetails({...details, ownerAddress: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Teléfono del propietario"
                                        value={details.ownerPhone}
                                        onChange={(e) => setDetails({...details, ownerPhone: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email del propietario"
                                        value={details.ownerEmail}
                                        onChange={(e) => setDetails({...details, ownerEmail: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <h4>Detalles del Encuentro</h4>
                                    <input
                                        type="text"
                                        placeholder="Punto de encuentro"
                                        value={details.meetingPoint}
                                        onChange={(e) => setDetails({...details, meetingPoint: e.target.value})}
                                        required
                                    />
                                    <input
                                        type="datetime-local"
                                        value={details.meetingDate}
                                        onChange={(e) => setDetails({...details, meetingDate: e.target.value})}
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn"
                                    disabled={!isFormValid()}
                                >
                                    {!isFormValid() 
                                        ? "Completa todos los campos" 
                                        : "Actualizar Detalles"}
                                </button>
                                <button 
                                    onClick={() => handleConfirmDelivery(exchange.offeredBook._id)}
                                    className="confirm-delivery-btn"
                                    disabled={!areDetailsUpdated()}
                                >
                                    {!areDetailsUpdated() 
                                        ? "Primero actualiza los detalles del intercambio"
                                        : "Confirmar que recibiste el libro ofrecido"}
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

                                        <button 
                                            onClick={() => handleConfirmDelivery(exchange.requestedBook._id)}
                                            className="confirm-delivery-btn"
                                            disabled={!areDetailsUpdated()}
                                        >
                                            {!areDetailsUpdated() 
                                                ? "Esperando que el solicitante actualice los detalles"
                                                : "Confirmar que entregaste el libro solicitado"}
                                        </button>
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
                    <div className="delivery-actions">
                        <div className="delivery-status">
                            <h4>Estado de las entregas:</h4>
                            <div className="book-status">
                                <p>Libro solicitado: 
                                    <span className={`status ${exchange.requestedBook.status === "intercambiado" ? "completed" : "pending"}`}>
                                        {exchange.requestedBook.status === "intercambiado" ? "Entregado" : "Pendiente"}
                                    </span>
                                </p>
                            </div>
                            <div className="book-status">
                                <p>Libro ofrecido: 
                                    <span className={`status ${exchange.offeredBook.status === "intercambiado" ? "completed" : "pending"}`}>
                                        {exchange.offeredBook.status === "intercambiado" ? "Entregado" : "Pendiente"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {exchange.isRequester ? (
                            <button 
                                onClick={() => handleConfirmDelivery(exchange.offeredBook._id)}
                                className="confirm-delivery-btn"
                                disabled={exchange.offeredBook.status === "intercambiado" || !areDetailsUpdated()}
                            >
                                {exchange.offeredBook.status === "intercambiado" 
                                    ? "Libro ya confirmado" 
                                    : !areDetailsUpdated()
                                        ? "Primero actualiza los detalles del intercambio"
                                        : "Confirmar que recibiste el libro ofrecido"}
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleConfirmDelivery(exchange.requestedBook._id)}
                                className="confirm-delivery-btn"
                                disabled={exchange.requestedBook.status === "intercambiado" || !areDetailsUpdated()}
                            >
                                {exchange.requestedBook.status === "intercambiado" 
                                    ? "Libro ya confirmado" 
                                    : !areDetailsUpdated()
                                        ? "Esperando que el solicitante actualice los detalles"
                                        : "Confirmar que entregaste el libro solicitado"}
                            </button>
                        )}
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
        </div>
    );
};

export default ExchangeDetails; 