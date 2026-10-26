import { Client as WorkflowClient } from "@upstash/workflow";

export const client = new WorkflowClient({
  baseUrl: process.env.QSTASH_URL!,
  token: process.env.QSTASH_TOKEN!,
});
