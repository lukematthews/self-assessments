import * as dotenv from 'dotenv';
import express from "express";
import http from "http";
import assessmentRouter from "./routes/assessments";
import uiRouter from "./routes/ui";
import criteriaDefinitionsRouter from "./routes/criteriaDefinitions";
import { connectDB } from "./config/dbConn";

dotenv.config(); // Load environment variables from the .env file
const PORT = process.env.PORT || 3000; // Access environment variables using process.env
console.log(`Server listening on port ${PORT}`);


function errorHandler(err: Error, req: express.Request, res: express.Response, next: express.NextFunction, logger?: (error: Error) => void) {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
}

connectDB();

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", assessmentRouter);
app.use("/api/items", criteriaDefinitionsRouter);
app.use("/ui", uiRouter);
app.use(errorHandler);

export default app;

app.set("port", PORT);
const server = http.createServer(app);
server.listen(PORT);