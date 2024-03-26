"use strict";
import React from 'react';
import {RouterProvider, createBrowserRouter,NavLink,Outlet} from 'react-router-dom'
import {Home} from '../View/Home';
import {About} from '../View/About';
import {Credits} from '../View/Credits';
import { Planet } from '../View/Planet';
import { ErrorPage } from '../View/ErrorPage';
import { CreatePlanet } from '../View/CreatePlanet';
import { Search } from '../View/Search';
import { useState } from 'react';

const router = createBrowserRouter([
  {path:'/',
  element:<Root/>,
  errorElement:<ErrorPage/>,
  children:[
    {path:'Home',element:<Home/>},
    {path:'Credits',element:<Credits/>},
    {path:'About',element:<About/>},
    {path:'Search',element:<Search/>},
    {path:'Planet/:name',element:<><Planet/></>},
    {path:'CreatePlanet',element:<CreatePlanet/>},

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

          <NavLink to="/Home" className="jacquesFrancois">Accueil</NavLink>

          <img src="/src/assets/line.png" className='separationBar' ></img>

          <NavLink to="/About" className="jacquesFrancois">About</NavLink>
            
          <img src="/src/assets/line.png" className='separationBar' ></img>

          <NavLink to="/Credits" className="jacquesFrancois">Credits</NavLink>

          <img src="/src/assets/line.png" className='separationBar' ></img>

          <NavLink to="/CreatePlanet" className="jacquesFrancois">Créer sa planète</NavLink>

          <img src="/src/assets/line.png" className='separationBar' ></img>

          <NavLink to="/Search" className="jacquesFrancois">Les planètes</NavLink>

          <img src="/src/assets/line.png" className='separationBar' ></img>

          <NavLink to="/Planet/tatooine" className="jacquesFrancois">Planète du jour</NavLink> 
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
  return await fetch("http://localhost:8090/planet/" + nom)
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

export async function addPlanet(planet,image){
  try{
    const response = await fetch('http://localhost:8090/planet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(planet)
    });
    if(response.status){
      if( image !=null){
        const formData = new FormData();
        formData.append('file', image);

        const requestOptions = {
          method: 'POST',
          body: formData
        };
        await fetch("http://localhost:8090/planet/"+planet.name, requestOptions)
          .then(response => {
            console.log(response)
            if (!response.ok) {
              throw new Error('La requête a échoué');
            }
            return response.json();
          })
          .then(data => {
            console.log('Réponse de l\'API:', data);
          })
          .catch(error => {
            console.error('Erreur lors de la requête Fetch:', error);
          });
      }
    }


    if (!response.ok) {
      throw new Error('Erreur lors de la requête HTTP');
    }
  } catch (error) {
    console.error('Une erreur s\'est produite:', error);
  }
}


export async function listPlanets(){

    return await fetch("http://localhost:8090/planet/")
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





export default App;
