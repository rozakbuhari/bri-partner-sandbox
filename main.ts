import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import data from "./data.json" assert { type: "json" };

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Welcome to dinosaur API!";
  })
  .get("/api", (context) => {
    context.response.body = data;
  })
  .get("/v2/inquiry/:account_number", (ctx) => {
    if (!ctx.request.headers["Authorization"]) {
      ctx.response.status = 401
      return;
    }

    if (!ctx.request.headers["BRI-Signature"] || !ctx.request.headers["BRI-Timestamp"]) {
      ctx.response.status = 400
      return;
    }

    ctx.response.body = {
        "responseCode": "0100",
        "responseDescription": "Inquiry success",
        "errorDescription": "",
        "Data": {
            "sourceAccount": "888801000157508",
            "sourceAccountName": "John Doe",
            "sourceAccountStatus": "Rekening Aktif",
            "sourceAccountBalace": "49615063835.3",
            "registrationStatus": "Rekening terdaftar an. BRI Application Program Interface"
        }
    }
  });

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
