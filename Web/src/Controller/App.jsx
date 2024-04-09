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

// URL du serveur Express
export const ExpressServeur = "http://localhost:8090"




const router = createBrowserRouter([
  {path:'/',
  element:<Root/>,// Élément racine de l'application
  errorElement:<ErrorPage/>,
  children:[// Enfants de l'élément racine, correspondant à différentes pages de l'application
    {path:'',element:<Search/>}, // Page d'accueil / Recherche
    {path:'Credits',element:<Credits/>}, // Page de crédits
    {path:'About',element:<About/>}, // Page "À propos"
    {path:'Search',element:<Search/>}, // Page de recherche
    {path:'Planet/:name',element:<><Planet/></>},// Page de détails d'une planète
    {path:'CreatePlanet',element:<CreatePlanet/>},// Page de création d'une nouvelle planète
    {path:'Vote',element:<Vote/>},// Page de vote pour les planètes


  ]

  },
  


])


/**
  * Fonction qui gère l'affichage de notre site web. (Dans le header : le menu hamburger))
*/
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

            <NavLink to="/Search" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">Les planètes</NavLink>

            <img src="/src/assets/line.png" className='separationBar' ></img>

            <NavLink to="/CreatePlanet" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">Créer sa planète</NavLink>

            <img src="/src/assets/line.png" className='separationBar' ></img>

            <NavLink to="/Vote" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">Voter !</NavLink>
              
            <img src="/src/assets/line.png" className='separationBar' ></img>

            <NavLink to="/Credits" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">Crédits</NavLink>
           
            <img src="/src/assets/line.png" className='separationBar' ></img>

            <NavLink to="/About" onClick={()=>setOpenMenu(false)} className="jacquesFrancois">A propos de nous</NavLink>
          </div>

        </nav>
      </header>
      <div><Outlet/></div>


    </>
  }

function App() {
  return <RouterProvider router={router}/>
}

/**
 * Fonction permettant de charger les styles spécifiés en paramètre.
 * @param {Array<string>} styles - Un tableau contenant les chemins vers les fichiers CSS à charger.
 */
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

/**
 * Fonction permettant de récupérer une planète par son nom.
 * @param {string} nom - Le nom de la planète à rechercher.
 * @returns {Array<Object>} Une liste qui contient la planète
 * @returns {null} null si la planète n'existe pas
 * @throws {Error} Une erreur si la requête HTTP échoue.
 */
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
/**
 * Fonction permettant de récupérer les votes d'une planète par son nom.
 * @param {string} nom - Le nom de la planète dont on souhaite récupérer les votes.
 * @returns {Object} Un objet qui contient le nombre de vote pour la planète
 * @returns {null} null si la planète n'existe pas
 * @throws {Error} Une erreur si la requête HTTP échoue.
 */
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
/**
 * Fonction permettant d'ajouter une nouvelle planète avec une image associée.
 * @param {Object} planet - Les informations de la planète à ajouter.
 * @param {File} image - L'image de la planète à associer (peut être null).
 * @returns {Number} Un code de retour indiquant le résultat de l'ajout :
 *                             - 1: Planète ajoutée avec succès.
 *                             - -1: Une erreur s'est produite lors de l'ajout de la planète.
 *                             - -2: Trop de planètes ajoutées aujourd'hui.
 *                             - -3: Erreur lors de l'envoi de l'image.
 */
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


/**
 * Récupère la liste des planètes depuis le serveur.
 * @returns {Array<Object>>} Un tableau d'objets représentant toutes les planètes de notre API (SWAPI + Base de données).
 *                                    Chaque objet contient les informations d'une planète.
 *                                    Si une erreur se produit ou si la réponse du serveur n'est pas valide, renvoie un tableau vide.
 * @throws {Error} Une erreur si la requête HTTP échoue ou si une erreur se produit lors du traitement de la réponse.
 */
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

/**
 * Récupère les planètes pour lequel l'utilisateur a voté
 * @returns {Array<Object>} Un tableau d'objets représentant les planètes ayant reçu un vote par l'utilisateur.
 *                                    Chaque objet contient les informations d'une planète.
 *                                    Si aucune adresse IP n'est récupérée ou si une erreur se produit, renvoie un tableau vide.
 * @throws {Error} Une erreur si une erreur se produit lors de la récupération de l'adresse IP ou lors de la requête HTTP.
 */
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


/**
 * Composant qui affiche une boîte d'erreur.
 * @param {boolean} isDisplayed - Indique si la boîte d'erreur doit être affichée ou non.
 * @param {string} errorText - Le texte de l'erreur à afficher dans la boîte.
 * @returns {JSX.Element} Le composant JSX représentant la boîte d'erreur.
 */
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