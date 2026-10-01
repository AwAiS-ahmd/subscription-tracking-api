import "./config/env.js";
import app from "./app.js";
import {prisma }from "./lib/prisma.js"

await prisma.$connect();
console.log("Database connected");

app.listen(process.env["PORT"], () => {
  console.log(`Subscription app listening on port ${process.env["PORT"]}`);
});
