import { Effect, Context, Schema, Layer } from "effect";
import { FetchError, JsonError } from "./errors";
import { Pokemon } from "./schemas";
import { PokemonCollection } from "./PokemonCollection";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl";

export class PokeApi extends Effect.Service<PokeApi>()("PokeApi", {
    effect: Effect.gen(function* () {
        const pokemonCollection = yield* PokemonCollection;
        const buildPokeApiUrl = yield* BuildPokeApiUrl;

        return {
            getPokemon: Effect.gen(function* () {
                const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] });

                const response = yield* Effect.tryPromise({
                    try: () => fetch(requestUrl),
                    catch: () => new FetchError(),
                });

                if (!response.ok) {
                    return yield* new FetchError();
                }

                const json = yield* Effect.tryPromise({
                    try: () => response.json(),
                    catch: () => new JsonError(),
                });

                return yield* Schema.decodeUnknown(Pokemon)(json);
            }),
        };
    }),
    dependencies: [PokemonCollection.Default, BuildPokeApiUrl.Default],
}) { }