import { MikroORM, NotFoundError, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { fastify, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const { FST_ERR_NOT_FOUND } = fastify.errorCodes;

declare module "fastify" {
  interface FastifyInstance {
    orm: MikroORM<PostgreSqlDriver>;
  }
}

const ormConnector: FastifyPluginAsync = async (app) => {
  const orm = await MikroORM.init<PostgreSqlDriver>();

  app.addHook("preHandler", (request, reply, done) => {
    RequestContext.create(orm.em, done);
  });

  app.decorate("orm", orm);

  const defaultErrorHandler = app.errorHandler;
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof NotFoundError) {
      reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: error.message,
      });
    } else {
      defaultErrorHandler(error, request, reply);
    }
  });
};

export default fp.default(ormConnector);
