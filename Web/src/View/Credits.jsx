import { setStyle } from "../Controller/App";

export function Credits() {
  setStyle({ styles: ["/src/Style/Credit.css"] }); //Nous permet de définir un style spécial pour chaque page

  let developpeur = [
    { name: 'Bryan', lastname:'Levy', age: 19, description: "", linkedin: '', gitlab: '' },
    { name: 'Basma', lastname:'Malki', age: 19, description: "", linkedin: '', gitlab: '' },
    { name: 'Clément', lastname:'Pasquet', age: 19, description: "", linkedin: '', gitlab: '' },
    { name: 'Justine', lastname:'Bernier', age: 19, description: "", linkedin: '', gitlab: '' },
    { name: 'Romain', lastname:'Bourget', age: 19, description: "", linkedin: '', gitlab: '' }
  ];

  return (
    <div className="containerBox">

      <div className="centralBox">

        {developpeur.map( (developpeurActuel, cle) => {
          return (
          <div key={cle} className="profileDiv">
            <img src={"/src/assets/"+developpeurActuel.name+" "+developpeurActuel.lastname+".jpg"} className="profileImage"></img>
            <div>
            <h2>{developpeurActuel.name}</h2>
            <h2>{developpeurActuel.lastname}</h2>
            </div>
            <img src="/src/assets/linkedin.svg" className="iconImage"></img>
            <div className="gitDiv">
              <img src="/src/assets/gitlab.svg" className="iconImage"></img>
              <img src="/src/assets/github.svg" className="iconImage"></img>
            </div>
          </div>
          
          );
        }) }

      </div>

    </div>
  );
}
