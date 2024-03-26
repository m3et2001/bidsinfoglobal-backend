'use strict';
import typesense from "typesense";

//* ====== TYPESENSE CONNECTION ======== //
const typesense_client = new typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST,
      port: process.env.TYPESENSE_PORT,
      protocol: "http",
    },
  ],
  apiKey:  process.env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 10,
});

typesense_client.health
  .retrieve()
  .then((data) => {
    console.log("== Typesense Connected ==", data);
  })
  .catch((err) => {
    console.log("== Typesense Error in Connection ==", err);
  });

export default typesense_client;
