import { Entity, ManyToOne, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { AttackCategory } from "./attack-category.entity.js";
import { AttackType } from "./attack-type.entity.js";
import type { Pokemon } from "./pokemon.entity.js";

@Entity()
@Unique({ properties: ['name', 'pokemon'] })
export class PokemonAttack {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @ManyToOne()
  pokemon!: Pokemon;

  @ManyToOne()
  type!: AttackType;

  @ManyToOne()
  category!: AttackCategory;

  @Property({ columnType: 'integer', unsigned: true })
  damage!: number;
}
