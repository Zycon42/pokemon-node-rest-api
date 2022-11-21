import { Check, Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Pokemon } from "./pokemon.entity.js";

@Entity()
@Check<PokemonEvolution>({
  expression: ({ requiredItemName, requiredItemAmount }) =>
    `NOT(${requiredItemName} IS NOT NULL AND ${requiredItemAmount} IS NULL)`,
})
export class PokemonEvolution {

  @ManyToOne({ primary: true })
  from!: Pokemon;
  @ManyToOne({ primary: true })
  to!: Pokemon;

  @Property()
  requiredItemName?: string;

  @Property({ columnType: "integer" })
  requiredItemAmount?: number;
}
