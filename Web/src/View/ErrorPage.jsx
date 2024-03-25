import { useRouteError } from "react-router-dom"
import {setStyle} from "../Controller/App"


export function ErrorPage(){
    setStyle({styles : ["/src/Style/index.css","/src/Style/ErrorPage.css"]}); //Nous permet de définir un style spécial pour chaque page

    const error = useRouteError()
    return <>
    <div className="errorView">
        <div className="errorPart">

            <h1>O<img className="planetImg" src="/src/assets/ErrorPlanet.png"></img>OPS !</h1>

            
            <div className="textDiv">
                <p className="errorCode">{error.status} {error.statusText}</p>

                {/* console.log(error) */}

                <p className="errorDescription">
                    {error.data}
                </p>


                <button onClick={() => window.location.href = "/Home"} className="homeButton">Go Home</button>
            </div>


        </div>

        <img className="errorIllustration" src="/src/assets/illustrationErrorPage.svg"></img>
    </div>
    </>
}