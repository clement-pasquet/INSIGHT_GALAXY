import { useNavigation, useParams } from "react-router-dom"
import {setStyle} from "../Controller/App"
import { getPlanetByName } from "../Controller/App";
import { useState, useEffect } from "react";

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
                        <h1>Tatooine {planet.name} </h1>
                        <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pulvinar rhoncus erat, nec aliquam turpis posuere ut. Ut efficitur ipsum quis nulla condimentum iaculis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc tempor tellus a nibh auctor scelerisque eu eget lorem. Suspendisse hendrerit lacus ornare mattis venenatis. Fusce aliquet in odio ut mollis. Fusce varius lectus at luctus aliquet. Fusce tempor nibh sed tristique laoreet. In finibus egestas nisl. </p>
                    </div>
                    
                    <img id="imagePlanet" src="/src/assets/tatooine.png"/>
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
    return <h1>La planète {name} n'existe pas !</h1>
}
