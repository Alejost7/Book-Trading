import '../../styles/donaciones/donaciones.css';
import { BookOpen, Plus, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';


const Donacion = () => {
    const navigate = useNavigate();
    return (
        <div className="donacion-container">
            <h1 className="donacion-title">📖 Crear Donación</h1>
            <div className="donacion-buttons">
                <span className="btn btn-primary">
                    <BookOpen size={60}/>
                    Seleccionar<br></br>libro
                    </span>
                <span className="btn btn-primary">
                    <Plus size={50}/>
                    Nuevo Libro
                </span>
            </div>
            <span className="btn btn-donar">
                <CheckCircle size={50}/>
                DONAR
            </span>
            <div className="donacion-info">
                <h3 className="donacion-body">
                    <p>
                        <strong>
                            Hola, aquí puedes donar los libros que quieras para que otros tenga la oportunidad de intercambiarlos<br></br>
                            Para más información o si tienes algún problema dirigete al apartado de ayuda sección "donar libros"
                        </strong>
                    </p>
                </h3>
                <button 
                    className="add-button" 
                    onClick={() => navigate("/")}><ArrowLeft />
                </button>
            </div>
        </div>
    );
};

export default Donacion