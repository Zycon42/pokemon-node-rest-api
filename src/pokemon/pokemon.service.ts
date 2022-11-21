import { FilterQuery, LoadStrategy, wrap } from "@mikro-orm/core";
import { AppInstance } from "../app.js";
import { PokemonEvolution } from "./entities/pokemon-evolution.entity.js";
import { PokemonType } from "./entities/pokemon-type.entity.js";
import { Pokemon } from "./entities/pokemon.entity.js";
import { PokemonDto, PokemonStubDto } from "./pokemon.dto.js";

export interface FindPokemonsArgs {
  limit: number;
  offset: number;
  filter: {
    isFavorite?: boolean;
    search?: string;
    type?: string;
  };
}

export function createPokemonService(app: AppInstance) {
  const { em } = app.orm;
  const repository = em.getRepository(Pokemon);

  async function allEvolutions(id: number) {
    const knex = em.getKnex();
    const query = knex
      .withRecursive("search_evolutions", (qb) =>
        qb
          .select("*", knex.raw("? as depth", [0]))
          .from("pokemon_evolution")
          .where("from_id", id)
          .unionAll((qb) =>
            qb
              .select("e.*", knex.raw("?? + 1", ["s.depth"]))
              .from(knex.ref("pokemon_evolution").as("e"))
              .join(
                knex.ref("search_evolutions").as("s"),
                "e.from_id",
                "s.to_id"
              )
          )
      )
      .select("*")
      .from("search_evolutions")
      .orderBy("depth");

    const res = await em.getConnection().execute(query);
    const evolutions = res.map((e) => em.map(PokemonEvolution, e));

    const firstEvolution = evolutions[0];
    const evolutionRequirement =
      firstEvolution != null &&
      firstEvolution.requiredItemName != null &&
      firstEvolution.requiredItemAmount != null
        ? {
            name: firstEvolution.requiredItemName,
            amount: firstEvolution.requiredItemAmount,
          }
        : undefined;

    await em.populate(evolutions, ["to.types"]);
    const pokemons = evolutions.map((e) => e.to);
    return {
      evolutionRequirement,
      evolutions: pokemons.map(toStubDto),
    };
  }

  async function toDto(pokemon: Pokemon): Promise<PokemonDto> {
    return {
      id: pokemon.id,
      name: pokemon.name,
      image: getPokemonImage(pokemon),
      weight:
        pokemon.minWeight != null && pokemon.maxWeight != null
          ? { minimum: pokemon.minWeight, maximum: pokemon.maxWeight }
          : undefined,
      height:
        pokemon.minHeight != null && pokemon.maxHeight != null
          ? { minimum: pokemon.minHeight, maximum: pokemon.maxHeight }
          : undefined,
      classification: pokemon.classification,
      types: pokemon.types.toArray().map(({ name }) => name),
      resistant: pokemon.resistantTo.toArray().map(({ name }) => name),
      weaknesses: pokemon.weaknesses.toArray().map(({ name }) => name),
      attacks: pokemon.attacks.toArray().map((attack) => ({
        type: attack.type.name,
        name: attack.name,
        category: attack.category.name,
        damage: attack.damage,
      })),
      ...(await allEvolutions(pokemon.id)),
      fleeRate: pokemon.fleeRate,
      maxCP: pokemon.maxCP,
      maxHP: pokemon.maxHP,
      isFavorite: pokemon.isFavorite,
    };
  }

  return {
    async getPokemonTypes() {
      const allTypes = await em.find(
        PokemonType,
        {},
        { orderBy: { name: "asc" } }
      );
      return allTypes.map(({ name }) => name);
    },

    async getPokemonById(id: number) {
      const pokemon = await repository.findOneOrFail(
        { id },
        {
          populate: true,
        }
      );
      return await toDto(pokemon);
    },

    async findPokemons({ limit, offset, filter }: FindPokemonsArgs) {
      const where: FilterQuery<Pokemon> = {};
      if (filter.isFavorite != null) {
        where.isFavorite = filter.isFavorite;
      }
      if (filter.search != null) {
        where.name = {
          $ilike: `%${filter.search.replaceAll(/(_|%)/g, "\\$1")}%`,
        };
      }
      if (filter.type != null) {
        where.types = { name: filter.type };
      }

      const [pokemons, totalCount] = await repository.findAndCount(where, {
        limit,
        offset,
        populate: ["types"],
        strategy: LoadStrategy.JOINED,
        orderBy: { id: "asc" },
      });

      return { totalCount, items: pokemons.map(toStubDto) };
    },

    async setIsFavorite(pokemonId: number, isFavorite: boolean) {
      const pokemon = await repository.findOneOrFail(pokemonId, {
        populate: true,
      });

      wrap(pokemon).assign({
        isFavorite
      });
      await repository.flush();
      return toDto(pokemon);
    },
  };
}

function toStubDto(pokemon: Pokemon): PokemonStubDto {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image: getPokemonImage(pokemon),
    types: pokemon.types.toArray().map(({ name }) => name),
  };
}

function getPokemonImage(pokemon: Pokemon) {
  return `https://img.pokemondb.net/artwork/${pokemon.name
    .toLowerCase()
    .replace(" ", "-")}.jpg`;
}
