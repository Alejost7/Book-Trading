import "../../styles/miPerfil/MiPerfil.css"
import ProfileCard from "./ProfileCard"
import spideypfp from "../../assets/images/spideypfp.jpg"
import Footer from "../inicio/beforeLogin/Footer"
import Navbar from "../inicio/beforeLogin/NavBar"
import MarkdownText from "./MarkdownText"

const MiPerfil = () => {
    return(
        <div>
            <Navbar />
                <div className="container">
                    <ProfileCard imgSrc={spideypfp} imgAlt={"Imagen de perfil"} username={"jorluos"} role={"Usuario"} name={"Jorge Osorio"}/>
                    <MarkdownText content={`
# 👋 ¡Hola, soy Jorge Luis!
Soy estudiante de **Ingeniería de Sistemas y Computación** en la *Universidad Javeriana* en Cali, Colombia.
💻 Me apasiona la programación
¡Siempre buscando mejorar y aprender de la manera más óptima posible! 🔥
---
*"El conocimiento no tiene límites, solo los que tú le pongas."*
                                    `}/>
                </div>
            <Footer />
        </div>
    )
}

export default MiPerfil