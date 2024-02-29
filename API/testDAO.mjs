
import {planeteDao } from "./planeteDao.mjs"

console.log(await planeteDao.findPlanetByNom("Mars"))