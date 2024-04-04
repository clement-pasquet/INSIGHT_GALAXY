import { useRef, useState } from "react"
import { useNavigate} from "react-router-dom"
import * as yup from 'yup';

import {addPlanet} from "../Controller/App"
import {setStyle} from "../Controller/App"


export function CreatePlanet(){
    setStyle({styles : ["/src/Style/index.css", "/src/Style/createPlanet.css"]}); //Nous permet de définir un style spécial pour chaque page

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
    const [selectedFile, setSelectedFile] = useState(null);

    const myInputRef = useRef();
    const myImageRef = useRef();
    const maxSizeBytes = 10 * 1024 * 1024;

    const navigate = useNavigate();

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
            if (file && file.size <= maxSizeBytes) {
                const imageUrl = URL.createObjectURL(file);
                myImageRef.current.src = imageUrl;
              }
              }} accept="image/png, image/jpeg"  />
                <button id="btn" type="button" value="" onClick={()=> {
                    let newPlanet = {name : name, description:description,rotationPeriod: rotationPeriod, orbitalePeriod:orbitalePeriod,diameter:diameter,climate:climate,gravity:gravity,terrain:terrain,surface_water:waterSurface,population:population}
                    validatePlanetData(newPlanet)
                    .then(isValid => {
                      if (isValid) {
                        // Ajouter la logique pour une planète valide ici
                        addPlanet(newPlanet,selectedFile).then(response => {
                            if(response){
                                let url = "/Search";
                                window.history.pushState(null, '', url);
                                window.dispatchEvent(new Event('popstate'));
                            }
                        })
                      } 
                    });
                    
                    

                }}>Envoyer</button>
            </div>
        </div>
    
    
    
    </>


}


// Fonction de validation des données de planète
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
  


