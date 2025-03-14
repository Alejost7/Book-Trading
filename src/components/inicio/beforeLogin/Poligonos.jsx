import '../../../styles/beforeLogin/poligonos.css';
import perfilIcon from '../../../assets/icons/myProfile.png';
import ayuda from '../../../assets/icons/ayuda.png';
const Poligonos = () => {
    return(
        <div className="poligonos">
            <div className="poligono poligono1">
                <img src={perfilIcon}></img>
            </div>
            <div className="poligono poligono2">
                <img src={ayuda}></img>
            </div>
            <div className="poligono poligono3"></div>
            <div className="poligono poligono4"></div>
        </div>
    );
};

export default Poligonos;