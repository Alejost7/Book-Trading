import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const AboutUs = () => {
const navigate = useNavigate();

useEffect(() => {
    const linkId = "bootstrap-temp-link";
    let bootstrapLink = document.getElementById(linkId);

    if (!bootstrapLink) {
        bootstrapLink = document.createElement("link");
        bootstrapLink.rel = "stylesheet";
        bootstrapLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
        bootstrapLink.integrity = "sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM";
        bootstrapLink.crossOrigin = "anonymous";
        bootstrapLink.id = linkId;
        document.head.appendChild(bootstrapLink);
    }

return () => {
    if (bootstrapLink && bootstrapLink.parentNode) {
    bootstrapLink.parentNode.removeChild(bootstrapLink);
    }
    };
}, []);

    return (
        <section style={{ backgroundColor: "#1a202c", color: "#f8f9fa" }} className="py-5">
        <div className="container">
            {/* Título principal */}
            <h2 className="text-center mb-5" style={{ fontSize: "2.5rem", fontWeight: "700" }}>
            Conoce <span style={{ color: "#253c5f" }}>BookSwap</span>
            </h2>

            {/* Descripción del servicio */}
            <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
                <div className="p-4 rounded" style={{ backgroundColor: "#253c5f" }}>
                <p className="lead text-center mb-3">
                    <strong>BookSwap</strong> es una aplicación web diseñada para fomentar el intercambio de libros entre lectores.
                    Los usuarios pueden subir libros que ya no usan, ofrecerlos y solicitar intercambios sin necesidad de comprarlos.
                </p>
                <p className="text-center">
                    Sube tus libros al apartado <strong>“Mis Libros”</strong>, ponlos en oferta y coordina el intercambio con otros usuarios.
                    Una vez entregado el libro, marca el intercambio como completado.
                </p>
                </div>
            </div>
            </div>

            <hr style={{ borderColor: "#253c5f" }} className="mb-5" />

            {/* Equipo */}
            <h2 className="text-center mb-4" style={{ fontWeight: "800" }}>Nuestro Equipo</h2>
            <p className="text-center mb-4">
            Tres estudiantes de <strong>Ingeniería de Sistemas y Computación</strong> de la <strong>Pontificia Universidad Javeriana de Cali</strong>.
            Este proyecto nace como iniciativa académica.
            </p>
            <div className="row g-4 justify-content-center">
            {/* Tarjeta 1 */}
            <div className="col-12 col-md-4">
                <div className="card h-100 bg-dark text-light shadow">
                <div className="card-body text-center">
                    <div className="mb-3">
                    <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: '#253c5f' }}></i>
                    </div>
                    <h3 className="card-title">Alejandro Santander Toro</h3>
                </div>
                </div>
            </div>
            {/* Tarjeta 2 */}
            <div className="col-12 col-md-4">
                <div className="card h-100 bg-dark text-light shadow">
                <div className="card-body text-center">
                    <div className="mb-3">
                    <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: '#253c5f' }}></i>
                    </div>
                    <h3 className="card-title">Jorge Luis Osorio</h3>
                </div>
                </div>
            </div>
            {/* Tarjeta 3 */}
            <div className="col-12 col-md-4">
                <div className="card h-100 bg-dark text-light shadow">
                <div className="card-body text-center">
                    <div className="mb-3">
                    <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: '#253c5f' }}></i>
                    </div>
                    <h3 className="card-title">Samuel Alberto Mateo Bonilla Franco</h3>
                </div>
                </div>
            </div>
            </div>

            <button className="add-button mt-4" onClick={() => navigate("/")}> 
            <FiArrowLeft />
            </button>
        </div>
        </section>
    );
};

export default AboutUs;
