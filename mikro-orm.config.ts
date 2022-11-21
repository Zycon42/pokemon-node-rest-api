import { Options, Platform, TextType, Type } from "@mikro-orm/core";
import type { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const config: Options<PostgreSqlDriver> = {
  entities: ["./dist/src/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  type: "postgresql",
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== 'production',

  discovery: {
    getMappedType(type: string, platform: Platform) {
      // map string to text instead of varchar(255), using text is best practice for postgres
      if (type === 'string') {
        return Type.getType(TextType);
      }
      return platform.getDefaultMappedType(type);
    }
  },

  migrations: {
    path: './dist/migrations',
    pathTs: './migrations',
  },
  seeder: {
    path: './dist/seeders',
    pathTs: './seeders',
  },
};

export default config;
