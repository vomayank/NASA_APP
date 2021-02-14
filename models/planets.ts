import { join } from "../deps.ts";
import { BufReader } from "../deps.ts";
import { parse } from "../deps.ts";
import { pick } from "../deps.ts";
import { log } from "../deps.ts";

// interface Planet {
//     [ key : string ] : string
// }

type Planet = Record<string, string>;

export function filterHabitablePlanets(planets : Array<Planet>) {
    return planets.filter((planet) => {
        const plantaryRadius = Number(planet["koi_prad"]);
        const stellarMass = Number(planet["koi_smass"]);
        const stellarRadius = Number(planet["koi_srad"]);
        return planet["koi_disposition"] === 'CONFIRMED'
            && plantaryRadius > 0.5 && plantaryRadius < 1.5
            && stellarMass > 0.78 && stellarMass < 1.04
            && stellarRadius> 0.99 && stellarRadius < 1.01;
    });
}

async function loadPlanetsData() {

    const path = join("data", "kepler_exoplanets_nasa.csv");

    const file = await Deno.open(path);
    const bufReader = new BufReader(file);
    const  result = await parse(bufReader, {
        comment: "#",
        trimLeadingSpace: true,
        skipFirstRow: true
    });
    Deno.close(file.rid);

    const planets = filterHabitablePlanets(result as Array<Planet>);

    return planets.map((planet) => {
        return pick(planet, [
          "kepler_name",
          "koi_prad",
          "koi_smass",
          "koi_srad",
          "koi_count",
          "koi_steff"
        ]);
    });
}
const planets = await loadPlanetsData();

log.info(`${planets.length} habitable planets found!`);

export function getAllPlanets() {
    return planets;
}