import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { pokemonSchema, pokemonStubSchema } from "./pokemon.dto.js";
import { createPokemonService } from "./pokemon.service.js";

const pokemonModule: FastifyPluginAsyncJsonSchemaToTs = async (app) => {
  const service = createPokemonService(app);

  app.get(
    "/pokemon/types",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: { type: "string" },
          },
        } as const,
      },
    },
    async (request, reply) => {
      return await service.getPokemonTypes();
    }
  );

  app.get(
    "/pokemon",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            limit: { type: "integer", minimum: 1 },
            offset: { type: "integer", minimum: 0 },
            isFavorite: { type: "boolean" },
            search: { type: "string" },
            type: { type: "string" },
          },
        } as const,
        response: {
          200: {
            type: 'object',
            properties: {
              totalCount: { type: 'integer' },
              items: {
                type: 'array',
                items: pokemonStubSchema,
              }
            },
            additionalProperties: false,
            required: ['totalCount', 'items'],
          } as const,
        }
      },
    },
    async (request, reply) => {
      const { limit, offset, isFavorite, search, type } = request.query;
      return await service.findPokemons({
        limit: limit ?? 10,
        offset: offset ?? 0,
        filter: { isFavorite, search, type },
      });
    }
  );

  app.get(
    "/pokemon/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
          additionalProperties: false,
        } as const,
        response: {
          200: pokemonSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      return await service.getPokemonById(id);
    }
  );

  app.patch(
    "/pokemon/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
          additionalProperties: false,
        } as const,
        body: {
          type: "object",
          properties: {
            isFavorite: { type: "boolean" },
          },
          additionalProperties: false,
          required: ['isFavorite']
        } as const,
        response: {
          200: pokemonSchema,
        },
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      return await service.setIsFavorite(id, request.body.isFavorite);
    }
  )
};

export default pokemonModule;
