import { setStyle } from "../Controller/App";


/**
 * Composant affichant les crédits de l'application, y compris les informations sur les développeurs.
 * @returns {JSX.Element} Le composant des crédits.
 */
export function Credits() {
  setStyle({ styles: ["/src/Style/Credit.css"] }); //Nous permet de définir un style spécial pour chaque page

  let developpeur = [
    { name: 'Bryan', lastname:'Levy', age: 19, description: "", linkedin: 'https://www.linkedin.com/in/bryan-levy-a7452a24a/', gitlab: 'https://gitlab.univ-nantes.fr/E224508F', github: 'https://github.com/IIBiniII' },
    { name: 'Basma', lastname:'Malki', age: 19, description: "", linkedin: 'https://www.linkedin.com/in/basma-malki-7b2a1525a/', gitlab: 'https://gitlab.univ-nantes.fr/E22C000R', github: 'https://github.com/basmamlk01' },
    { name: 'Clément', lastname:'Pasquet', age: 19, description: "", linkedin: 'https://fr.linkedin.com/in/clément-pasquet', gitlab: 'https://gitlab.univ-nantes.fr/E22A210W', github: 'https://github.com/clement-pasquet' },
    { name: 'Justine', lastname:'Bernier', age: 19, description: "", linkedin: 'https://www.linkedin.com/in/justine-bernier-bb956224b/', gitlab: 'https://gitlab.univ-nantes.fr/E228120G', github : 'https://github.com/jubernier' },
    { name: 'Romain', lastname:'Bourget', age: 19, description: "", linkedin: 'https://www.linkedin.com/in/romain-bourget-682877270/', gitlab: 'https://gitlab.univ-nantes.fr/E225486T' , githun: '' }
  ];

  return (
    <div className="containerBox">

      <div className="centralBox">

        {developpeur.map( (developpeurActuel, cle) => {
          return (
          <div key={cle} className="profileDiv">
            <img src={"/src/assets/"+developpeurActuel.name+".jpg"} className="profileImage"></img>
            <div>
            <h2>{developpeurActuel.name}</h2>
            <h2>{developpeurActuel.lastname}</h2>
            </div>
            <a  href={developpeurActuel.linkedin}>
            <img src="/src/assets/linkedin.svg" className="iconImage"/>
            </a>
            <div className="gitDiv">
              <a href={developpeurActuel.gitlab}>
                <img src="/src/assets/gitlab.svg" className="iconImage"/>
              </a>
              <a href={developpeurActuel.github}>
                <img src="/src/assets/github.svg" className="iconImage" href={developpeurActuel.github}/>
              </a>
            </div>
          </div>
          
          );
        }) }

      </div>
        <p>Notre application utilise l'API <a href="https://swapi.dev/">SWAPI</a> </p>
    </div>
  );
}
