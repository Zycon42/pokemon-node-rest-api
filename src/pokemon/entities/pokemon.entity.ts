import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import { AttackType } from "./attack-type.entity.js";
import { PokemonAttack } from "./pokemon-attack.entity.js";
import { PokemonType } from "./pokemon-type.entity.js";

@Entity()
export class Pokemon {
  // For MicroORM to know isFavorite has default value and doesn't need to be provided for creating entity
  [OptionalProps]?: "isFavorite";

  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  name!: string;

  @ManyToMany({ fixedOrder: true })
  types = new Collection<PokemonType>(this);

  @ManyToMany({ fixedOrder: true })
  resistantTo = new Collection<AttackType>(this);

  @ManyToMany({ fixedOrder: true })
  weaknesses = new Collection<AttackType>(this);

  @OneToMany(() => PokemonAttack, (attack) => attack.pokemon)
  attacks = new Collection<PokemonAttack>(this);

  @Property()
  classification?: string;

  @Property()
  minWeight?: string;

  @Property()
  maxWeight?: string;

  @Property()
  minHeight?: string;

  @Property()
  maxHeight?: string;

  @Property({ columnType: "float" })
  fleeRate?: number;

  @Property({ columnType: "integer", unsigned: true })
  maxCP?: number;

  @Property({ columnType: "integer", unsigned: true })
  maxHP?: number;

  @Property()
  isFavorite = false;
}
