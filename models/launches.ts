import { log } from "../deps.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

interface Launch{
    flightNumber: number;
    mission: string;
    rocket: string;
    customers: Array<string>;
    launchDate: number;
    upcoming: boolean;
    success?: boolean;
    target?: string;
}
const launches = new Map<number, Launch>();

async function downloadLunchData() {
    log.info("Downloading the lunch data......");
    log.warning("THis is a warning...");
  const response = await fetch("https://api.spacexdata.com/v3/launches", {
      method: "GET"
  });

  if(!response.ok){
      log.warning("Problem downloading lunch data !");
      throw new Error("Data Download Faild");
  }

  const lunchData = await response.json();
  for (const launch of lunchData){

        const payloads  = launch["rocket"]["second_stage"]["payloads"];
        const customers = _.flatMap(payloads, (payload : any ) => {
            return payload["customers"];
        });

      const flightData = {
          flightNumber: launch["flight_number"],
          mission: launch["mission_name"],
          rocket: launch["rocket"]["rocket_name"],
          launchDate: launch["launch_date_unix"],
          upcoming: launch["upcoming"],
          success: launch["launch_success"],
          customers: customers
      };
      launches.set(flightData.flightNumber, flightData);
  }
}


await downloadLunchData();
log.info(`Download data for ${launches.size} SpaceX launches.`);

export function getAll() {
    return Array.from(launches.values());
}

export function getOne(id: number) {
    if(launches.has(id)){
        return launches.get(id);
    }
    return null;
}

export function addOne(data : Launch) {
    launches.set(data.flightNumber, Object.assign(data, {
        upcoming: true,
        customers: ["Zero To Mastery", "NASA"],
    }));
}

export function removeOne(id: number) {
    const aborted = launches.get(id);
    if(aborted){
        aborted.upcoming = false;
        aborted.success = false;
    }
    return aborted;
}
