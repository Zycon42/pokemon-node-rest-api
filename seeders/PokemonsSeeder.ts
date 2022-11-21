import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { AttackCategory } from "../src/pokemon/entities/attack-category.entity.js";
import { AttackType } from "../src/pokemon/entities/attack-type.entity.js";
import { PokemonAttack } from "../src/pokemon/entities/pokemon-attack.entity.js";
import { PokemonEvolution } from "../src/pokemon/entities/pokemon-evolution.entity.js";
import { PokemonType } from "../src/pokemon/entities/pokemon-type.entity.js";
import { Pokemon } from "../src/pokemon/entities/pokemon.entity.js";
import data from "./pokemons.json" assert { type: "json" };

type EvolutionDesc = {
  fromId: number;
  toId: number;
  requiredItemName: string;
  requiredItemAmount: number;
};

export class PokemonsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const pokemonTypes = new Map<string, PokemonType>();
    const attackTypes = new Map<string, AttackType>();
    const attackCategories = new Map<string, AttackCategory>();

    // because evolution is a association entity table, we need to w8 until all pokemons are created
    // so collect them to this accumulator
    const evolutions: EvolutionDesc[] = [];

    for (const row of data) {
      const id = Number(row.id);
      const types = row.types.map((type) =>
        getOrCreate(pokemonTypes, type, (name) =>
          em.create(PokemonType, { name })
        )
      );
      const resistantTo = row.resistant.map((type) =>
        getOrCreate(attackTypes, type, (name) =>
          em.create(AttackType, { name })
        )
      );
      const weaknesses = row.weaknesses.map((type) =>
        getOrCreate(attackTypes, type, (name) =>
          em.create(AttackType, { name })
        )
      );

      const pokemon = em.create(Pokemon, {
        id,
        name: row.name,
        types,
        resistantTo,
        weaknesses,
        classification: row.classification,
        minWeight: row.weight.minimum,
        maxWeight: row.weight.maximum,
        minHeight: row.height.minimum,
        maxHeight: row.height.maximum,
        fleeRate: row.fleeRate,
        maxCP: row.maxCP,
        maxHP: row.maxHP,
      });

      for (const [attackCategoryName, attackRows] of Object.entries(
        row.attacks
      )) {
        const category = getOrCreate(
          attackCategories,
          attackCategoryName,
          (name) => em.create(AttackCategory, { name })
        );
        for (const attackRow of attackRows) {
          em.create(PokemonAttack, {
            name: attackRow.name,
            pokemon,
            category,
            type: getOrCreate(attackTypes, attackRow.type, (name) =>
              em.create(AttackType, { name })
            ),
            damage: attackRow.damage,
          });
        }
      }

      const evolution = row.evolutions?.[0];
      if (evolution != null && row.evolutionRequirements != null) {
        evolutions.push({
          fromId: id,
          toId: evolution.id,
          requiredItemName: row.evolutionRequirements.name,
          requiredItemAmount: row.evolutionRequirements.amount,
        });
      }
    }

    for (const evolution of evolutions) {
      em.create(PokemonEvolution, { 
        from: em.getReference(Pokemon, evolution.fromId),
        to: em.getReference(Pokemon, evolution.toId),
        requiredItemName: evolution.requiredItemName,
        requiredItemAmount: evolution.requiredItemAmount,
       });
    }
  }
}

function getOrCreate<T>(
  map: Map<string, T>,
  key: string,
  factory: (key: string) => T
) {
  if (map.has(key)) {
    return map.get(key)!;
  }
  const obj = factory(key);
  map.set(key, obj);
  return obj;
}
