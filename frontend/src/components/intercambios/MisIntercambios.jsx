import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ExchangeDetails from '../tradeLibros/ExchangeDetails';
import '../../styles/afterLogin/afterLogin.css';

const MisIntercambios = ({ userId }) => {
    const [exchanges, setExchanges] = useState([]);
    const [selectedExchange, setSelectedExchange] = useState(null);
    const [showExchangeDetails, setShowExchangeDetails] = useState(false);

    const fetchExchanges = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/exchanges?userId=${userId}`);
            // Ordenar los intercambios por fecha, los más recientes primero
            const sortedExchanges = response.data.sort((a, b) => 
                new Date(b.requestedAt) - new Date(a.requestedAt)
            );
            setExchanges(sortedExchanges);
        } catch (error) {
            console.error("Error fetching exchanges:", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchExchanges();
        // Actualización automática cada 5 segundos
        const interval = setInterval(fetchExchanges, 5000);
        return () => clearInterval(interval);
    }, [fetchExchanges]);

    const handleExchangeResponse = async (exchangeId, action) => {
        try {
            const response = await axios.patch(`http://localhost:5000/exchanges/${exchangeId}`, {
                status: action
            });

            if (response.data.exchange) {
                setExchanges(prevExchanges => 
                    prevExchanges.map(exchange => 
                        exchange._id === exchangeId ? response.data.exchange : exchange
                    )
                );
            }
        } catch (error) {
            console.error('Error al responder al intercambio:', error);
            alert(error.response?.data?.message || 'Error al procesar la respuesta del intercambio');
        }
    };

    const handleViewExchangeDetails = (exchange) => {
        setSelectedExchange(exchange);
        setShowExchangeDetails(true);
    };

    return (
        <div className="exchanges-container">
            <div className="exchanges-grid">
                {exchanges.length > 0 ? (
                    exchanges.map((exchange) => (
                        <div key={exchange._id} className="exchange-card">
                            <div className="exchange-books">
                                <div className="book-info">
                                    <h4>Libro Solicitado</h4>
                                    <img src={exchange.requestedBook.image} alt={exchange.requestedBook.title} />
                                    <p>{exchange.requestedBook.title}</p>
                                </div>
                                <div className="book-info">
                                    <h4>Libro Ofrecido</h4>
                                    <img src={exchange.offeredBook.image} alt={exchange.offeredBook.title} />
                                    <p>{exchange.offeredBook.title}</p>
                                </div>
                            </div>
                            <div className="exchange-status">
                                <p>Estado: {exchange.status}</p>
                                {exchange.status === "pendiente" && exchange.isRequester && (
                                    <div className="exchange-actions">
                                        <button onClick={() => handleViewExchangeDetails(exchange)}>
                                            Ver Detalles
                                        </button>
                                    </div>
                                )}
                                {exchange.status === "pendiente" && exchange.isOwner && (
                                    <div className="exchange-actions">
                                        <button onClick={() => handleExchangeResponse(exchange._id, "aceptado")}>
                                            Aceptar
                                        </button>
                                        <button onClick={() => handleExchangeResponse(exchange._id, "rechazado")}>
                                            Rechazar
                                        </button>
                                    </div>
                                )}
                                {exchange.status === "aceptado" && exchange.isRequester && 
                                 (!exchange.exchangeDetails || exchange.exchangeDetails.status !== "meetup_scheduled") && (
                                    <div className="exchange-actions">
                                        <button onClick={() => handleViewExchangeDetails(exchange)}>
                                            Coordinar Entrega
                                        </button>
                                    </div>
                                )}
                                {exchange.status === "aceptado" && (
                                    exchange.isOwner || 
                                    (exchange.isRequester && exchange.exchangeDetails?.status === "meetup_scheduled")
                                ) && (
                                    <div className="exchange-actions">
                                        <button onClick={() => handleViewExchangeDetails(exchange)}>
                                            Ver Detalles de Entrega
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-content-message">
                        <p>En este momento no hay nada para mostrar</p>
                    </div>
                )}
            </div>

            {showExchangeDetails && selectedExchange && (
                <ExchangeDetails
                    exchange={selectedExchange}
                    onClose={() => {
                        setShowExchangeDetails(false);
                        setSelectedExchange(null);
                        fetchExchanges(); // Actualizar los intercambios al cerrar el modal
                    }}
                    userId={userId}
                />
            )}
        </div>
    );
};

export default MisIntercambios; 