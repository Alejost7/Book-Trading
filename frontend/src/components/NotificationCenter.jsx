import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/notifications/notifications.css';
const API_URL = import.meta.env.VITE_API_URL;


const NotificationCenter = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/notifications/notifications/${userId}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            const interval = setInterval(() => {
                fetchNotifications();
            }, 5000); // Fetch notifications every 5 seconds
            return () => clearInterval(interval);
        }
    }, [userId, fetchNotifications]);

    const markAsRead = async (notificationId) => {
        try {
            await axios.patch(`${API_URL}/notifications/${notificationId}/read`);
            setNotifications(notifications.map(notification => 
                notification._id === notificationId 
                    ? { ...notification, read: true }
                    : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            await axios.delete(`${API_URL}/notifications/${userId}/all`);
            setNotifications([]); // Limpiar las notificaciones del estado
        } catch (error) {
            console.error('Error deleting all notifications:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notification-container">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="notification-button"
            >
                <svg 
                    className="notification-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3 className="notification-title">Notificaciones</h3>
                        {notifications.length > 0 && (
                            <button 
                                className="delete-all-button"
                                onClick={deleteAllNotifications}
                            >
                                Borrar todas las notificaciones
                            </button>
                        )}
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                No hay notificaciones
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification._id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                    onClick={() => markAsRead(notification._id)}
                                >
                                    <p className="notification-message">{notification.message}</p>
                                    <p className="notification-time">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter; 