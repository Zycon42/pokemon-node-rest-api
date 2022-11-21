import app from './app.js';
import orm from './orm.js';
import pokemonModule from './pokemon/pokemon.module.js';

process.on('unhandledRejection', (reason, p) => {
  app.log.fatal({ err: reason, promise: p }, 'Unhandled promise rejection');
  process.exit(1);
});

try {
  app.register(orm);
  app.register(pokemonModule, { prefix: '/v1' });

  const port = Number(process.env.PORT || 4000);
  await app.listen({ port, host: '0.0.0.0' });
} catch (err) {
  app.log.fatal({ err }, 'Failed to start server!');
  process.exit(1);
}
