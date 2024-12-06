import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "../test/node";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());