import "../../styles/miPerfil/MiPerfil.css"
import ProfileCard from "./ProfileCard"
import spideypfp from "../../assets/images/spideypfp.jpg"
import Footer from "../inicio/beforeLogin/Footer"
import Navbar from "../inicio/beforeLogin/NavBar"

const MiPerfil = () => {
    return(
        <div>
            <Navbar />
            <ProfileCard imgSrc={spideypfp} imgAlt={"Imagen de perfil"} username={"jorluos"} role={"Usuario"} name={"Jorge Osorio"}/>
            <Footer />
        </div>
    )
}

export default MiPerfil