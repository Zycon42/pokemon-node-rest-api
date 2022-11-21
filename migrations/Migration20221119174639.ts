import { Migration } from '@mikro-orm/migrations';

export class Migration20221119174639 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "attack_category" ("id" serial primary key, "name" text not null);');
    this.addSql('alter table "attack_category" add constraint "attack_category_name_unique" unique ("name");');

    this.addSql('create table "attack_type" ("id" serial primary key, "name" text not null);');
    this.addSql('alter table "attack_type" add constraint "attack_type_name_unique" unique ("name");');

    this.addSql('create table "pokemon" ("id" serial primary key, "name" text not null, "classification" text null, "min_weight" text null, "max_weight" text null, "min_height" text null, "max_height" text null, "flee_rate" float null, "max_cp" integer null, "max_hp" integer null, "is_favorite" boolean not null default false);');
    this.addSql('alter table "pokemon" add constraint "pokemon_name_unique" unique ("name");');

    this.addSql('create table "pokemon_resistant_to" ("id" serial primary key, "pokemon_id" int not null, "attack_type_id" int not null);');

    this.addSql('create table "pokemon_weaknesses" ("id" serial primary key, "pokemon_id" int not null, "attack_type_id" int not null);');

    this.addSql('create table "pokemon_attack" ("id" serial primary key, "name" text not null, "pokemon_id" int not null, "type_id" int not null, "category_id" int not null, "damage" integer not null);');
    this.addSql('alter table "pokemon_attack" add constraint "pokemon_attack_name_pokemon_id_unique" unique ("name", "pokemon_id");');

    this.addSql('create table "pokemon_evolution" ("from_id" int not null, "to_id" int not null, "required_item_name" text null, "required_item_amount" integer null, constraint "pokemon_evolution_pkey" primary key ("from_id", "to_id"), constraint pokemon_evolution_check check (NOT(required_item_name IS NOT NULL AND required_item_amount IS NULL)));');

    this.addSql('create table "pokemon_type" ("id" serial primary key, "name" text not null);');
    this.addSql('alter table "pokemon_type" add constraint "pokemon_type_name_unique" unique ("name");');

    this.addSql('create table "pokemon_types" ("id" serial primary key, "pokemon_id" int not null, "pokemon_type_id" int not null);');

    this.addSql('alter table "pokemon_resistant_to" add constraint "pokemon_resistant_to_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_resistant_to" add constraint "pokemon_resistant_to_attack_type_id_foreign" foreign key ("attack_type_id") references "attack_type" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_weaknesses" add constraint "pokemon_weaknesses_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_weaknesses" add constraint "pokemon_weaknesses_attack_type_id_foreign" foreign key ("attack_type_id") references "attack_type" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "pokemon_attack" add constraint "pokemon_attack_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade;');
    this.addSql('alter table "pokemon_attack" add constraint "pokemon_attack_type_id_foreign" foreign key ("type_id") references "attack_type" ("id") on update cascade;');
    this.addSql('alter table "pokemon_attack" add constraint "pokemon_attack_category_id_foreign" foreign key ("category_id") references "attack_category" ("id") on update cascade;');

    this.addSql('alter table "pokemon_evolution" add constraint "pokemon_evolution_from_id_foreign" foreign key ("from_id") references "pokemon" ("id") on update cascade;');
    this.addSql('alter table "pokemon_evolution" add constraint "pokemon_evolution_to_id_foreign" foreign key ("to_id") references "pokemon" ("id") on update cascade;');

    this.addSql('alter table "pokemon_types" add constraint "pokemon_types_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "pokemon_types" add constraint "pokemon_types_pokemon_type_id_foreign" foreign key ("pokemon_type_id") references "pokemon_type" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pokemon_attack" drop constraint "pokemon_attack_category_id_foreign";');

    this.addSql('alter table "pokemon_resistant_to" drop constraint "pokemon_resistant_to_attack_type_id_foreign";');

    this.addSql('alter table "pokemon_weaknesses" drop constraint "pokemon_weaknesses_attack_type_id_foreign";');

    this.addSql('alter table "pokemon_attack" drop constraint "pokemon_attack_type_id_foreign";');

    this.addSql('alter table "pokemon_resistant_to" drop constraint "pokemon_resistant_to_pokemon_id_foreign";');

    this.addSql('alter table "pokemon_weaknesses" drop constraint "pokemon_weaknesses_pokemon_id_foreign";');

    this.addSql('alter table "pokemon_attack" drop constraint "pokemon_attack_pokemon_id_foreign";');

    this.addSql('alter table "pokemon_evolution" drop constraint "pokemon_evolution_from_id_foreign";');

    this.addSql('alter table "pokemon_evolution" drop constraint "pokemon_evolution_to_id_foreign";');

    this.addSql('alter table "pokemon_types" drop constraint "pokemon_types_pokemon_id_foreign";');

    this.addSql('alter table "pokemon_types" drop constraint "pokemon_types_pokemon_type_id_foreign";');

    this.addSql('drop table if exists "attack_category" cascade;');

    this.addSql('drop table if exists "attack_type" cascade;');

    this.addSql('drop table if exists "pokemon" cascade;');

    this.addSql('drop table if exists "pokemon_resistant_to" cascade;');

    this.addSql('drop table if exists "pokemon_weaknesses" cascade;');

    this.addSql('drop table if exists "pokemon_attack" cascade;');

    this.addSql('drop table if exists "pokemon_evolution" cascade;');

    this.addSql('drop table if exists "pokemon_type" cascade;');

    this.addSql('drop table if exists "pokemon_types" cascade;');
  }

}
