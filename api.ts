import { Router } from "./deps.ts";

import * as planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";

const router = new Router();

router.get("/", (ctx) => {
    ctx.response.body = "This A Test Trails";
});

router.get("/planets", (ctx) => {
    // throw new Error("Sample error");
    ctx.response.body = planets.getAllPlanets();
});

router.get("/launches", (ctx) => {
    ctx.response.body = launches.getAll();
});

router.get("/launches/:id", (ctx) => {
    if(ctx.params?.id){
        const launchesList = launches.getOne(Number(ctx.params.id));
        if(launchesList){
            ctx.response.body = launchesList;
        }else{
            ctx.throw(400, "Lunch With that ID doesn't exits");
        } 
    }
});

router.delete("/launches/:id", (ctx) => {
    if(ctx.params?.id){
        const result = launches.removeOne(Number(ctx.params.id));
        ctx.response.body = { success: result };
    }
});

router.post("/launches", async (ctx) => {

    const body = ctx.request.body();
    if (body.type === "json") {
        const value = await body.value; // an object of parsed JSON
        launches.addOne(value);
        ctx.response.body = { success: true };
        ctx.response.status = 201;
    }
});

export default router;