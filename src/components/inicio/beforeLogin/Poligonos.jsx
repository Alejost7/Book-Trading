import '../../../styles/beforeLogin/poligonos.css';
import perfilIcon from '../../../assets/icons/avatar-de-hombre.png';
import ayuda from '../../../assets/icons/ayuda.png';
import sobreNosotros from '../../../assets/icons/sobre-nosotros.png';
import libroIcon from '../../../assets/icons/lectura.png';
const Poligonos = () => {
    return(
        <div className="poligonos">
            <div className="poligono poligono1">
                <img src={perfilIcon}></img>
            </div>
            <div className="poligono poligono2">
                <img src={ayuda}></img>
            </div>
            <div className="poligono poligono3">
                <img src={sobreNosotros}></img>
            </div>
            <div className="poligono poligono4">
                <img src={libroIcon}></img>
            </div>
        </div>
    );
};

export default Poligonos;