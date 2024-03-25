import { useRouteError } from "react-router-dom"
import {setStyle} from "../Controller/App"


export function ErrorPage(){
    setStyle({styles : ["/src/Style/index.css","/src/Style/ErrorPage.css"]}); //Nous permet de définir un style spécial pour chaque page

    const error = useRouteError()
    return <><div className="errorPart">
            <h1>O<img className="planetImg" src="/src/assets/ErrorPlanet.png"></img>OPS</h1>

        
        La page que vous essayer de rejoindre n'existe pas !
        <p>
            {console.log(error)}
        </p>
        <img className="errorIllustration" src="/src/assets/illustrationErrorPage.svg"></img>

    </div>
    </>
}

function m() {

}