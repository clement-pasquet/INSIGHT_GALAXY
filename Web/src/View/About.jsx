import {setStyle} from "../Controller/App"


export function About(){
    setStyle({styles : ["/src/Style/index.css","/src/Style/About.css"]}); //Nous permet de définir un style spécial pour chaque page

    return <div className="center">
        <p>Nous sommes une équipe de cinq développeurs, étudiants en BUT Informatique à l'IUT de Nantes, passionnés par l'univers de Star Wars. Nous avons le plaisir de vous présenter Insight Galaxy, un site web parfait pour tous les fans de Star Wars.</p>
        <p>Insight Galaxy est un site web qui répertorie les planètes de l’univers de Star Wars. Grâce à l’<a href="https://swapi.dev/">API SWAPI</a>, nous avons pu récupérer toutes ces planètes. <br/>Notre application permet aux fans de Star Wars de créer leur propre planète et de les soumettre aux votes d'autres fans de Star Wars. <br/>Chaque semaine, une nouvelle planète créée par les utilisateurs est ajoutée au site.</p>
    </div>
}