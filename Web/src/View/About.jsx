import {setStyle} from "../Controller/App"


export function About(){
    setStyle({styles : ["/src/Style/index.css"]}); //Nous permet de définir un style spécial pour chaque page

    return <p>About</p>
}