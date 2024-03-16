import {setStyle} from "../Controller/App"


export function Credits() {
    setStyle({styles : ["/src/Style/index.css"]}); //Nous permet de définir un style spécial pour chaque page

    let developpeur = [{ name: 'Bryan Levy', age: 19, description: "", linkedin: '', gitlab: '' },{ name: 'Basma Malki', age: 19, description: "", linkedin: '', gitlab: '' },{ name: 'Clément Pasquet', age: 19, description: "", linkedin: '', gitlab: '' },{ name: 'Justine Bernier', age: 19, description: "", linkedin: '', gitlab: '' },{ name: 'Romain Bourget', age: 19, description: "", linkedin: '', gitlab: '' }];
  
    return (
      <div>
        <h1>Les crédits</h1>
        <p>Ce site a été réalisé par 5 développeurs, étudiants en BUT informatique</p>
        <div>
          {developpeur.map((element, index) => (
            <div key={index}>
              {element.name}
            </div>
          ))}
        </div>
      </div>
    );
  }
  