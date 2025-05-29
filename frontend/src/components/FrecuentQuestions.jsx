import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft} from "react-icons/fi";

const faqs = [
    {
        question: "¿Cómo funciona el intercambio de libros?",
        answer:
        "Los usuarios suben libros a su perfil y pueden ponerlos en oferta. Otros usuarios pueden solicitar un intercambio ofreciendo un libro a cambio. Si ambas partes aceptan, se coordina el envío y se marca como entregado.",
    },
    {
        question: "¿Puedo leer los libros en la plataforma?",
        answer:
        "No, por ahora BookSwap solo permite el intercambio físico de libros entre usuarios. La funcionalidad de lectura en línea no está disponible en esta etapa del proyecto.",
    },
    {
        question: "¿Quiénes están detrás de BookSwap?",
        answer:
        "BookSwap es un proyecto desarrollado por tres estudiantes de Ingeniería de Sistemas y Computación de la Pontificia Universidad Javeriana de Cali: Alejandro Santander Toro, Jorge Luis Osorio y Samuel Alberto Mateo Bonilla Franco.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const Navigate = useNavigate();
    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    
};

return (
        <section
        style={{
            backgroundColor: '#1a202c',
            color: '#f8f9fa',
            padding: '40px 20px',
            borderRadius: '8px',
            maxWidth: '800px',
            margin: '0 auto',
        }}
        >
        <h2
            style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '2rem',
            fontWeight: '700',
            }}
        >
            Preguntas <span style={{ color: '#253c5f' }}>Frecuentes</span>
        </h2>

        {faqs.map((item, index) => (
            <div
            key={index}
            style={{
                marginBottom: '16px',
                border: '1px solid #253c5f',
                borderRadius: '4px',
                overflow: 'hidden',
            }}
            >
            <button
                onClick={() => toggle(index)}
                style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '16px',
                textAlign: 'left',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#f8f9fa',
                cursor: 'pointer',
                }}
            >
                {item.question}
            </button>
            {openIndex === index && (
                <div
                style={{
                    padding: '0 16px 16px',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#d1d5db',
                    backgroundColor: '#253c5f',
                }}
                >
                {item.answer}
                </div>
            )}
            </div>
        ))}
        <button className="add-button" onClick={() => Navigate("/")}> <FiArrowLeft/> </button>
        </section>
        
    );
};

export default FAQ;
