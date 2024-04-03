import { setStyle } from "../Controller/App";

export function Credits() {
  setStyle({ styles: ["/src/Style/Credit.css"] }); //Nous permet de définir un style spécial pour chaque page

  let developpeur = [
    { name: 'Bryan Levy', age: 19, description: "", linkedin: '', gitlab: '' },
    { name: 'Basma Malki', age: 19, description: "", linkedin: '', gitlab: '' },
    { name: 'Clément Pasquet', age: 19, description: "", linkedin: '', gitlab: '' },
    { name: 'Justine Bernier', age: 19, description: "", linkedin: '', gitlab: '' },
    { name: 'Romain Bourget', age: 19, description: "", linkedin: '', gitlab: '' }
  ];

  return (
    <div className="team-container">
      {developpeur.map((dev, index) => (
        <div className="team-member" key={index}>
          <img src={`${dev.name.toLowerCase()}.jpg`} alt={dev.name} />
          <h3>{dev.name}</h3>
          <a href="#"><img src="linkedin.png" alt="LinkedIn" /></a>
        </div>
      ))}
    </div>
  );
}
