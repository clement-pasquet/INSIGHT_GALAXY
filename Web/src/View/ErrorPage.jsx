import { useRouteError } from "react-router-dom"
import {setStyle} from "../Controller/App"


export function ErrorPage(){
    setStyle({styles : ["/src/Style/index.css"]}); //Nous permet de définir un style spécial pour chaque page

    const error = useRouteError()
    return <div>
        La page que vous essayer de rejoindre n'existe pas !
        <p>
            {error?.error?.toString() ?? error?.toString()}
        </p>
    </div>
}