import {planeteDao } from "./PlaneteDAO.mjs"

planeteDao.delete() //Réinitialise la bd

console.log(await planeteDao.findPlanetByNomSWAPI("tatooine"))
// console.log(await planeteDao.findPlanets())
// let planet = new Planet({name:'Marroon',rotation_period:"12",orbital_period:"365",diameter:"150000",climate:"Arid",gravity:"1.2",terrain:"dessert",surface_water:"25",population:"120000",type:"En attente"})
// console.log(await planeteDao.addPlanete(planet))
// console.log(await planeteDao.findPlanets())



