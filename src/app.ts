import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { fastify } from "fastify";

const isProdEnv = process.env.NODE_ENV === "production";
const logLevel = process.env.LOG_LEVEL || "debug";

const app = fastify({
  logger: {
    level: isProdEnv ? "info" : logLevel,
  },
}).withTypeProvider<JsonSchemaToTsProvider>();

export default app;

export type AppInstance = typeof app;
