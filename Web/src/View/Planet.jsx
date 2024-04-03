import { useNavigation, useParams } from "react-router-dom"
import {ExpressServeur, setStyle} from "../Controller/App"
import { getPlanetByName } from "../Controller/App";
import { useState, useEffect } from "react";
import { ErrorPage } from "./ErrorPage";

export function Planet(){
    setStyle({styles : ["/src/Style/Planet.css"]}); //Nous permet de définir un style spécial pour chaque page
    const {name} = useParams()
    const [planet, setPlanet] = useState({});
    const {state} = useNavigation()
    useEffect(() => {
        const getPlanet = async () => {
            let myPlanet = await getPlanetByName(name)
            if (myPlanet != null){
                myPlanet = myPlanet[0]
                setPlanet(myPlanet)

            }
        };

        getPlanet();
    }, []); 
    
    return <>{state === 'loading' && <div><h1>CHARGEMENT ...</h1></div>}
            {planet == undefined && <UndefinedPlanet name={name}/>}

            {state === 'idle' && planet != undefined && <div>
        <div id="grandeBoite">
            <div id="titleImagePlanet">
                    <div id="text">
                        <h1>{planet.name} </h1>
                        <p> {planet.description!=null?planet.description : "Pas de description pour cette planète"} </p>
                    </div>
                    
                    <img id="imagePlanet" src={ExpressServeur+"/planet/image/"+planet.name}/> 
                    {/* <img id="like" src="/src/assets/heart.svg"/> */}
            </div>
            <div className="informationsPart">
                <ul>
                    <li>
                        <img src="/src/assets/water.svg" alt="Logo de la surface de l'eau" />
                        <div>
                            <p>Surface Water : {planet.surface_water}%</p>
                        </div>
                    </li>
                    <li>
                        <img src="/src/assets/orbital.svg" alt="Logo de la periode orbital"  />
                        <div>
                            <p>Orbital period : {planet.orbital_period}</p>
                        </div>
                    </li>
                    <li>
                        <img src="/src/assets/diameter.svg" alt="Logo d'un diametre"  />
                        <div>
                            <p>Diameter : {planet.diameter}</p>
                        </div>
                    </li>
                    <li>
                        <img src="/src/assets/population.svg" alt="Logo d'une population" />
                        <div>
                            <p>Population : {planet.population}</p>
                        </div>
                    </li>
                    <li>
                        <img src="/src/assets/rotation.svg" alt="Logo d'un temps de rotation" />
                        <div>
                            <p>Rotation period : {planet.rotation_period}</p>
                        </div>
                    </li>
                    <li>
                        <img src="/src/assets/terrain.svg" alt="Logo d'un terrain" />
                        <div>
                            <p>Terrain : {planet.terrain}</p>
                        </div>
                    </li>
                    <li>
                        <img src="/src/assets/climate.svg" alt="Logo d'un thermometre" />
                        <div>
                            <p>Climate : {planet.climate}</p>
                        </div>
                    </li>
                    <li>
                        <img src="/src/assets/gravity.svg" alt="Logo de la gravité" />
                        <div>
                            <p>Gravity: {planet.gravity}</p>
                        </div>
                    </li>


                </ul>
            </div>
        </div>
    </div>}
    
    </>
}

function UndefinedPlanet({name}){
    const error = new Error("La planète "+name+" n'existe pas !");
    error.statusText = "La planète "+name+" n'existe pas !";

    throw error
}


