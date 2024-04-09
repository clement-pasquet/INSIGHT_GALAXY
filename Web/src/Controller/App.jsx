"use strict";
import React from 'react';
import {RouterProvider, createBrowserRouter,NavLink,Outlet} from 'react-router-dom'
import {About} from '../View/About';
import {Credits} from '../View/Credits';
import { Planet } from '../View/Planet';
import { ErrorPage } from '../View/ErrorPage';
import { CreatePlanet } from '../View/CreatePlanet';
import { Search } from '../View/Search';
import { useState } from 'react';
import { Vote } from '../View/Vote';


export const ExpressServeur = "http://localhost:8090"




const router = createBrowserRouter([
  {path:'/',
  element:<Root/>,
  errorElement:<ErrorPage/>,
  children:[
    {path:'',element:<Search/>},
    {path:'Credits',element:<Credits/>},
    {path:'About',element:<About/>},
    {path:'Search',element:<Search/>},
    {path:'Planet/:name',element:<><Planet/></>},
    {path:'CreatePlanet',element:<CreatePlanet/>},
    {path:'Vote',element:<Vote/>},


  ]

  },
  


])



function Root(){

  const [isOpenMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu(!isOpenMenu)
    console.log("clique sur logo")
  }


    return <>
      <header>


        <nav className={`navBar ${isOpenMenu ? '' : 'navBarClosed'}`}>
          <img src="/src/assets/helmet.svg" className={`${isOpenMenu ? 'insightGalaxyLogoInside ' : 'insightGalaxyLogoOutside'}`} onClick={toggleMenu} ></img>


          <div className={` ${isOpenMenu ? 'navBarOpened' : 'navBarClosed'}`}>

            <NavLink to="/Planet/tatooine" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">Planète du jour</NavLink> 

            <img src="/src/assets/line.png" className='separationBar' ></img>

            <NavLink to="/Search" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">Les planètes</NavLink>

            <img src="/src/assets/line.png" className='separationBar' ></img>

            <NavLink to="/CreatePlanet" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">Créer sa planète</NavLink>

            <img src="/src/assets/line.png" className='separationBar' ></img>

            <NavLink to="/Vote" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">Voter !</NavLink>
            {/* <NavLink to="/About" className="jacquesFrancois">About</NavLink> */}
              
            <img src="/src/assets/line.png" className='separationBar' ></img>

            <NavLink to="/Credits" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">Crédits</NavLink>
          </div>

        </nav>
      </header>
      <div><Outlet/></div>


    </>
  }

function App() {
  return <RouterProvider router={router}/>
}

export function setStyle({styles}){
  // Supprimer tous les styles existants
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    link.remove();
  });

  styles.forEach((style) => {
    // Ajouter un nouveau lien vers le fichier CSS
    let newStylesheet = document.createElement('link');
    newStylesheet.rel = 'stylesheet';
    newStylesheet.href = style;
    document.head.appendChild(newStylesheet);
  })

}

export async function getPlanetByName(nom) {
  return await fetch(ExpressServeur+"/planet/" + nom)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la requête HTTP');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Erreur:', error);
      throw error; // Vous pouvez choisir de relancer l'erreur ou de la traiter ici
    });
}

export async function getVotePlanetByName(nom) {
  return await fetch(ExpressServeur+"/getvote/" + nom)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la requête HTTP');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Erreur:', error);
      throw error; // Vous pouvez choisir de relancer l'erreur ou de la traiter ici
    });
}

export async function addPlanet(planet, image) {
  //Retour de la fonction : 
  // 1 => Planète bien ajouté
  // -1 => Une erreur s'est produit lors de l'ajout d'une planète
  // -2 => Trop de planètes ajoutés aujourd'hui
  // -3 => Erreur lors de l'envoi de l'image
  try {
    const response = await fetch(ExpressServeur + '/planet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(planet)
    });
    if(response.status == 501){
      return -2
    }

    if (!response.ok) {
      throw new Error('Erreur lors de la requête HTTP');
    }

    if (image != null) {
      const formData = new FormData();
      formData.append('file', image);

      const requestOptions = {
        method: 'POST',
        body: formData
      };

      const imageUploadResponse = await fetch(ExpressServeur + "/planet/" + planet.name, requestOptions);

      if (!imageUploadResponse.ok) {
        console.error('Erreur lors de l\'envoi de l\'image:', imageUploadResponse);
        return -3;
      }
    }

    return 1; // Ajout de la planète avec succès
  } catch (error) {
    console.error('Une erreur s\'est produite:', error);
    return -1; // Erreur lors de l'ajout de la planète
  }
}



export async function listPlanets(){

    return await fetch(ExpressServeur+"/planet/")
    .then(response => {
      if (!response.ok) {
        return []
      }
      return response.json();
    })
    .catch(error => {
      console.error('Erreur:', error);
      throw error; // Vous pouvez choisir de relancer l'erreur ou de la traiter ici
    });
}

export async function votedPlanets(){
  try {
    let ip_address = {};

    try {
        const response = await fetch('https://api.ipify.org/?format=json');
        
        if (response.status === 200) {
            const ip_data = await response.json();
            ip_address = ip_data;
            console.log(ip_address); // Affiche l'adresse IP récupérée
        } else {
            console.error('Erreur lors de la récupération de l\'adresse IP: Statut HTTP', response.status);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'adresse IP:', error);
    }
    if(ip_address.ip){

      return await fetch(ExpressServeur+"/allvote/",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ip_address)
      })
      .then(response => {
        if (!response.ok) {
          return []
        }
        return response.json();
      })
      .catch(error => {
        console.error('Erreur:', error);
        throw error; // Vous pouvez choisir de relancer l'erreur ou de la traiter ici
      });
    }else{
      return []
    }
  }catch (error){
    console.error('Erreur lors de la requête:', error);
    return []
  }
}



export function ErrorBox({isDisplayed, errorText}) {
    return (
      <div className={isDisplayed?"errorBox fadeInOut":"hide"}>
        <div className="errorContent">
          <img src="/src/assets/dangerIcon.png" alt="Error" className="errorImage" />
          <p className="errorText">{errorText}</p>
        </div>
      </div>
    );
}



export default App;