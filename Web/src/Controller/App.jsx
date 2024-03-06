import React from 'react';
import {RouterProvider, createBrowserRouter,NavLink,Outlet} from 'react-router-dom'
import {Home} from '../View/Home';
import {About} from '../View/About';
import {Credits} from '../View/Credits';
import { Planet } from '../View/Planet';
import { ErrorPage } from '../View/ErrorPage';
// import { planeteDao } from '../../../API/PlaneteDAO.mjs'; => erreur de dépendance entre https-proxy et agent-base

const router = createBrowserRouter([
  {path:'/',
  element:<Root/>,
  errorElement:<ErrorPage/>,
  children:[
    {path:'Home',element:<Home/>},
    {path:'Credits',element:<Credits/>},
    {path:'About',element:<About/>},
    {path:'Planet/:name',element:<Planet/>}
  ]

  },
  


])

function Root(){
  return <>
    <header>
      <nav>
        <NavLink to="/Home">Home</NavLink>
        <NavLink to="/About">About</NavLink>
        <NavLink to="/Credits">Credits</NavLink>
        <NavLink to="/Planet/tatooine">Example</NavLink>

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

export function getPlanetByName(nom){
   return {name: 'Tatooine',
   rotation_period: '23',
   orbital_period: '304',
   diameter: '10465',
   climate: 'arid',
   gravity: '1 standard',
   terrain: 'desert',
   surface_water: '1',
   population: '200000',
   type: 'Original'} //await planeteDao.findPlanetByNomBD(nom)
}

export default App;
