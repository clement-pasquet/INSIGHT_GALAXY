import { useNavigation, useParams } from "react-router-dom"
import {ExpressServeur, setStyle} from "../Controller/App"
import { getPlanetByName,getVotePlanetByName } from "../Controller/App";
import { useState, useEffect } from "react";
import { ErrorPage } from "./ErrorPage";

export function Planet(){
    setStyle({styles : ["/src/Style/Planet.css"]}); //Nous permet de définir un style spécial pour chaque page
    const {name} = useParams()
    const [planet, setPlanet] = useState({});
    const [nbVote, setNbVote] = useState(0);

    const {state} = useNavigation()
    // Hook pour charger la planète
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

    useEffect(() => {

        if (planet.type == "En attente"){
            const getVotePlanet = async () => {
                let myVote = await getVotePlanetByName(name)
                if(myVote != null){
                    setNbVote(myVote.count)
                }
            };
            getVotePlanet();
        }
    }, [planet]); 

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
            </div>
            {planet.type=="En attente"? <div className="votePart"><img src="/src/assets/vote.png"/><p>{nbVote} vote{nbVote>1?"s":""}</p></div>:<></>}

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
                            <p>Population : {separateNumbers(planet.population)}</p>
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

/**
 * Lance une erreur indiquant qu'une planète avec le nom spécifié n'existe pas.
 * @param {string} name - Le nom de la planète qui n'existe pas.
 * @throws {Error} Une erreur indiquant que la planète avec le nom spécifié n'existe pas.
 */
function UndefinedPlanet({name}){
    const error = new Error("La planète "+name+" n'existe pas !");
    error.statusText = "La planète "+name+" n'existe pas !";

    throw error
}


/**
 * Transforme un nombre en une chaîne de caractères avec des espaces insérés tous les multiples de mille.
 * @param {String} number - Le nombre à formater.
 * @returns {String} Une chaîne de caractères représentant le nombre avec des espaces insérés tous les multiples de mille.
 */
function separateNumbers(number) {
    let numberString = String(number);
    // Utilise une expression régulière pour ajouter un espace chaque trois chiffres à partir de la droite
    numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return numberString;
}
