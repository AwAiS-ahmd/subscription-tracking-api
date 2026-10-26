import express, { type Express } from "express";
import { sendReminder } from "../controllers/workflow.controller.js";

const workflowRouter = express.Router();

workflowRouter.post("/reminders", sendReminder);
export default workflowRouter;
