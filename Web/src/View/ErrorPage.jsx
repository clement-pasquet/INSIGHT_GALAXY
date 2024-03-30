import { useRouteError } from "react-router-dom"
import {setStyle} from "../Controller/App"


export function ErrorPage({ error }){
    setStyle({styles : ["/src/Style/index.css","/src/Style/ErrorPage.css"]}); //Nous permet de définir un style spécial pour chaque page

    if (!error) {
        error = useRouteError();
    }
    const status = error.status
    return <>
    <div className="errorView">
        <div className="errorPart">

            <h1>O<img className="planetImg" src="/src/assets/ErrorPlanet.png"></img>PS !</h1>

            
            <div className="textDiv">
                <p className="errorCode"> {status?"Erreur "+status: "Erreur"}</p>

                {/* console.log(error) */}

                <p className="errorDescription">
                    {messageError(error)}
                </p>


                <button onClick={() => window.location.href = "/Home"} className="homeButton">Go Home</button>
            </div>


        </div>

        <img className="errorIllustration" src="/src/assets/illustrationErrorPage.svg"></img>
    </div>
    </>
}


function messageError(error){
    switch (error.status){
        case 404 :
            return "La page demandé n'existe pas !"

        default:
            return error.statusText
    }
}