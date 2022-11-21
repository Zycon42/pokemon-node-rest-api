import { FromSchema } from "json-schema-to-ts";

export const pokemonSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string" },
    image: { type: "string", format: "url" }, 
    weight: { $ref: "#/definitions/dimension" },
    height: { $ref: "#/definitions/dimension" },
    classification: { type: "string" },
    types: {
      type: "array",
      items: { type: "string" },
    },
    resistant: {
      type: "array",
      items: { type: "string" },
    },
    weaknesses: {
      type: "array",
      items: { type: "string" },
    },
    attacks: {
      type: "array",
      items: { $ref: "#/definitions/attack" },
    },
    evolutionRequirement: {
      $ref: "#/definitions/evolutionRequirement",
    },
    evolutions: {
      type: "array",
      items: { $ref: "#/definitions/stub" },
    },
    fleeRate: { type: "number" },
    maxCP: { type: "integer" },
    maxHP: { type: "integer" },
    isFavorite: { type: "boolean" },
  },
  additionalProperties: false,
  required: [
    "id",
    "name",
    "image",
    "types",
    "resistant",
    "weaknesses",
    "attacks",
    "isFavorite",
  ],
  definitions: {
    dimension: {
      type: "object",
      properties: {
        minimum: { type: "string" },
        maximum: { type: "string" },
      },
      additionalProperties: false,
      required: ["minimum", "maximum"],
    },
    attack: {
      type: "object",
      properties: {
        name: { type: "string" },
        type: { type: "string" },
        category: { type: "string" },
        damage: { type: "integer" },
      },
      additionalProperties: false,
      required: ["name", "type", "category", "damage"],
    },
    evolutionRequirement: {
      type: "object",
      properties: {
        name: { type: "string" },
        amount: { type: "integer" },
      },
      additionalProperties: false,
      required: ["name", "amount"],
    },
    stub: {
      type: "object",
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        image: { type: "string", format: "url" },
        types: {
          type: "array",
          items: { type: "string" },
        },
      },
      additionalProperties: false,
      required: ["id", "name", "image", "types"],
    }
  },
} as const;

export type PokemonDto = FromSchema<typeof pokemonSchema>;

export const pokemonStubSchema = pokemonSchema.definitions.stub;

export type PokemonStubDto = FromSchema<typeof pokemonSchema['definitions']['stub']>;
