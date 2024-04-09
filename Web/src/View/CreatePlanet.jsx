import { useRef, useState } from "react"
import * as yup from 'yup';

import {ErrorBox, addPlanet} from "../Controller/App"
import {setStyle} from "../Controller/App"

/**
 * Vue qui permet de créer une nouvelle planète.
 * @returns {JSX.Element} Le formulaire de création de planète.
 */
export function CreatePlanet(){
    setStyle({styles : ["/src/Style/index.css", "/src/Style/createPlanet.css"]}); //Nous permet de définir un style spécial pour chaque page

    // Gestion des états pour les champs du formulaire 
    let [name,setNom] = useState('')
    let [description,setDescription] = useState('')
    let [waterSurface,setWaterSurface] = useState('')
    let [orbitalePeriod,setOrbitalePeriod] = useState('')
    let [diameter,setDiameter] = useState('')
    let [population,setPopulation] = useState('')
    let [rotationPeriod,setRotationPeriod] = useState('')
    let [terrain,setTerrain] = useState('')
    let [climate,setClimate] = useState('')
    let [gravity,setgravity] = useState('')

    // Gestion de l'état pour l'affichage des erreurs
    let [errorDisplayed,setErrorDisplayed] = useState(false)
    let [errorMessage,setErrorMessage] = useState("")

    // Gestion du fichier sélectionné pour l'image de la planète
    const [selectedFile, setSelectedFile] = useState(null);

    // Références pour les éléments du formulaire
    const myInputRef = useRef();
    const myImageRef = useRef();
    //Taille maximale de l'image
    const maxSizeBytes = 10 * 1024 * 1024;


    return <>
        <div id="grandeBoite">
            <div id="boite2">
                <input type="text"  value={name} onChange={(e)=> setNom(e.target.value)} placeholder="Nom" />
                <input type="text" value={description} onChange={(e)=> setDescription(e.target.value)} placeholder="Description"/>
                
                <input type="text" value={waterSurface} onChange={(e)=> setWaterSurface(e.target.value)} placeholder="Surface D'eau"/>
                
                <input type="text" value={orbitalePeriod} onChange={(e)=> setOrbitalePeriod(e.target.value)} placeholder="Période orbitale"/>
                
                <input type="text" value={diameter} onChange={(e)=> setDiameter(e.target.value)} placeholder="Diamètre"/>
            </div>
            <div id="boite">
                <img id="planete" ref={myImageRef} src="src/assets/planetePlus.png"></img>
                <img id="plus" onClick={()=>{myInputRef.current.click();}} src="src/assets/plus.png"></img>
            </div>
            <div id="boite3">
                <input type="text" value={population} onChange={(e)=> setPopulation(e.target.value)} placeholder="Population"/>
                
                <input type="text" value={rotationPeriod} onChange={(e)=> setRotationPeriod(e.target.value)} placeholder="Période de rotation"/>
                
                <input type="text" value={terrain} onChange={(e)=> setTerrain(e.target.value)} placeholder="Terrain"/>
                
                <input type="text" value={climate} onChange={(e)=> setClimate(e.target.value)} placeholder="Climat"/>
                
                <input type="text" value={gravity} onChange={(e)=> setgravity(e.target.value)} placeholder="Gravité"/>
                <input type="file" style={{ display: 'none' }} ref={myInputRef} onChange={(event) => {
            const file = event.target.files[0]; setSelectedFile(file);
            if (file ) {
                if(file.size <= maxSizeBytes){
                    const imageUrl = URL.createObjectURL(file);
                    myImageRef.current.src = imageUrl;
                }else{
                    setErrorDisplayed(true)
                    setErrorMessage("Le fichier doit être inférieur à 10 Mo !")
                    setTimeout(()=>{
                        setErrorDisplayed(false)
                    },5000)
                }

                }else{
                    setErrorDisplayed(true)
                    setErrorMessage("Il n'y a pas de fichier selectionné")
                    setTimeout(()=>{
                        setErrorDisplayed(false)
                    },5000)
                }
              }} accept="image/png, image/jpeg"  />
                <button id="btn" type="button" value="" onClick={()=> {
                    let newPlanet = {name : name, description:description,rotationPeriod: rotationPeriod, orbitalePeriod:orbitalePeriod,diameter:diameter,climate:climate,gravity:gravity,terrain:terrain,surface_water:waterSurface,population:population}
                    validatePlanetData(newPlanet)
                    .then(isValid => {
                      if (isValid) {
                        // Ajouter la logique pour une planète valide ici
                        addPlanet(newPlanet,selectedFile).then(response => {
                            if(response == 1){
                                let url = "/Search";
                                window.history.pushState(null, '', url);
                                window.dispatchEvent(new Event('popstate'));
                            }else if(response==-1){
                                setErrorDisplayed(true)
                                setErrorMessage("Une erreur s'est produit lors de l'ajout d'une planète")
                                setTimeout(()=>{
                                    setErrorDisplayed(false)
                                },5000)

                            }else if(response==-2){
                                setErrorDisplayed(true)
                                setErrorMessage("Trop de planètes ont été ajoutés aujourd'hui")
                                setTimeout(()=>{
                                    setErrorDisplayed(false)
                                },5000)

                            }else if(response==-3){
                                setErrorDisplayed(true)
                                setErrorMessage("Une erreur est survenue lors de l'envoi de l'image")
                                setTimeout(()=>{
                                    setErrorDisplayed(false)
                                },5000)

                            }
                        })
                      }else{
                            setErrorDisplayed(true)
                            setErrorMessage("Les champs ne sont pas correctes")
                            setTimeout(()=>{
                                setErrorDisplayed(false)
                            },5000)
                      }
                    });
                    
                    

                }}>Envoyer</button>
            </div>
        </div>
        <ErrorBox isDisplayed={errorDisplayed} errorText={errorMessage}/>

    
    
    
    </>


}


/**
 * Valide les données d'une planète selon un schéma défini avec Yup.
 * @param {Object} planetData - Les données de la planète à valider.
 * @param {string} planetData.name - Le nom de la planète.
 * @param {string} planetData.description - La description de la planète.
 * @param {number} planetData.rotationPeriod - La période de rotation de la planète (en jours).
 * @param {number} planetData.orbitalePeriod - La période orbitale de la planète (en jours).
 * @param {number} planetData.diameter - Le diamètre de la planète (en kilomètres).
 * @param {string} planetData.climate - Le climat de la planète.
 * @param {string} planetData.gravity - La gravité de la planète.
 * @param {string} planetData.terrain - Le terrain de la planète.
 * @param {number} planetData.surface_water - La proportion d'eau à la surface de la planète (en pourcentage).
 * @param {number} planetData.population - La population de la planète.
 * @returns {Boolean} Renvoie un booleen avec true si les données sont valides, sinon false.
 */
const validatePlanetData = async (planetData) => {
    // Définir le schéma de validation avec Yup
    const planetSchema = yup.object().shape({
        name: yup.string().required(),
        description: yup.string().required(),
        rotationPeriod: yup.number().positive().required(),
        orbitalePeriod: yup.number().positive().required(),
        diameter: yup.number().positive().required(),
        climate: yup.string().required(),
        gravity: yup.string().required(),
        terrain: yup.string().required(),
        surface_water: yup.number().positive().required(),
        population: yup.number().positive().required(),
        });
    try {
      await planetSchema.validate(planetData);
      // Les données sont valides
      return true;
    } catch (error) {
      // Une erreur de validation s'est produite
      return false;
    }
  };
  


