import {setStyle} from "../Controller/App"


export function Home(){
    setStyle({styles : ["/src/Style/index.css"]}); //Nous permet de définir un style spécial pour chaque page

    return <div>
        <h1>Home</h1>
        <p>Bienvenue sur notre site !</p>
    
    </div>
}