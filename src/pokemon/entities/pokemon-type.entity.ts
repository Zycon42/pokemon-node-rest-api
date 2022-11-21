import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity()
export class PokemonType {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  name!: string;
}
