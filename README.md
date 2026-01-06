## base types

Collection of TypeScript utility types and helpers I use across projects.

### Install

```bash
npm install @yigal/base_types
```

### Quick start

```ts
import {
  s2t,
  s2u,
  p2u,
  nl,
  Key,
  Atom,
  is_atom,
  is_key,
  is_atom_ex,
  get_error,
  is_object,
  has_key,
  objects_only,
  has_keys,
  pk,
  is_promise,
  resolve_maybe_promise,
  is_string_array,
  sleep,
  getCommonPrefix,
  default_get,
} from '@yigal/base_types'

// Ensure a value is not null/undefined
const userId = nl(process.env.USER_ID)

// Narrow unknowns
function handle(x: unknown) {
  if (is_atom(x)) {
    // x: Atom (number | string | boolean)
  }
  if (is_key(x)) {
    // x: Key (number | string)
  }
}

// Work with objects safely
const maybeObj: unknown = { a: 1, b: 2 }
if (is_object(maybeObj)) {
  if (has_key(maybeObj, 'a')) {
    // property 'a' exists on object
  }
}

// Pick a subset of properties (optionally from undefined)
const picked = pk({ a: 1, b: 2, c: 3 }, 'a', 'c') // { a: 1, c: 3 }

// Handle promises
if (is_promise(value)) {
  const result = await value
}

// Resolve value or promise
const result = await resolve_maybe_promise(maybePromise)

// Check string arrays
if (is_string_array(data)) {
  // data: string[]
}

// Sleep/delay
await sleep(1000) // wait 1 second

// Get common prefix of paths
const prefix = getCommonPrefix(['a/b/c', 'a/b/d']) // 'a/b'

// Default value getter
const value = default_get(obj, 'key', () => defaultValue)
```

### API overview

- **Types**
  - `s2t<T>`: `Record<string, T>`
  - `s2u`: `Record<string, unknown>`
  - `p2u`: `Record<PropertyKey, unknown>`
  - `Key`: `number | string`
  - `Atom`: `number | string | boolean`
  - `strset`: `Set<string>`
  - `s2num`: `Record<string, number>`
  - `s2s`: `Record<string, string>`
  - `num2num`: `Record<number, number>`
  - `MaybePromise<T>`: `T | Promise<T>` — value that may or may not be a promise
  - `Test`: Interface for test cases used by `run_tests`

- **Functions**
  - `nl<T>(value: T | null | undefined): T` — throws if value is `null`/`undefined`.
  - `is_atom(x: unknown): x is Atom` — type guard for primitive atoms.
  - `is_key(x: unknown): x is Key` — type guard for usable object keys (string/number).
  - `is_atom_ex(v: unknown, place: string, k = ''): v is Atom` — like `is_atom` but logs a warning with context when false.
  - `get_error(x: unknown): Error` — always returns an `Error` instance for any value.
  - `is_object<T extends object = s2u>(value: unknown): value is T` — true for plain objects and functions; excludes arrays, `Set`, and `Map`.
  - `has_key(obj: unknown, k: string): boolean` — safe `in` check after validating object.
  - `objects_only(ar: unknown[]): Iterable<object>` — generator yielding only object values from an array.
  - `has_keys(obj: unknown, keys: string[]): boolean` — checks presence of any key in `keys` on `obj`.
  - `pk<T, K extends keyof T>(obj: T | undefined, ...keys: K[]): Pick<T, K>` — pick properties from possibly undefined object.
  - `is_promise<T=void>(value: unknown): value is Promise<T>` — type guard for promises (checks for `then` method).
  - `resolve_maybe_promise<T>(a: MaybePromise<T>): Promise<T>` — resolves a value that may or may not be a promise.
  - `is_string_array(a: unknown): a is string[]` — type guard for string arrays.
  - `sleep(ms: number): Promise<void>` — returns a promise that resolves after the specified milliseconds.
  - `getCommonPrefix(paths: string[]): string` — returns the common path prefix from an array of paths.
  - `default_get<T>(obj: Record<PropertyKey, T>, k: PropertyKey, maker: () => T): T` — gets a value from an object, creating it with `maker` if missing.
  - `run_tests(...tests: Test[]): Promise<void>` — runs test cases and reports results.
  - `mkdir_write_file(filePath: string, data: string): Promise<void>` — creates directory if needed and writes file (Node.js only).
  - `read_json_object(filename: string, object_type: string): Promise<object | undefined>` — reads and parses a JSON file as an object (Node.js only).

- **Classes**
  - `Repeater` — class for repeatedly executing a function with delays.
    - `is_running: boolean` — control flag to stop repetition.
    - `repeat(f: () => MaybePromise<void>): Promise<void>` — repeatedly calls `f` with 2-second delays while `is_running` is true.

- **Constants**
  - `green`, `red`, `yellow`, `reset` — ANSI color codes for terminal output.

### Development

- **Scripts** (see `package.json`):
  - `watch_build`: Rebuild on changes via `build.mjs`.
  - `watch_tsc`: TypeScript project build in watch mode.
  - `run_biome`: Run Biome linter.
  - `run_eslint`: Run ESLint (Visual Studio formatter).
  - `test`: Run tests from `dist/test.js` (ensure build artifacts exist).

#### Local setup

```bash
# install deps
npm install

# type-check in watch mode
npm run watch_tsc

# build on change (esbuild script)
npm run watch_build

# lint
npm run run_biome
npm run run_eslint
```

### Notes

- `types` are published alongside the package; consumers get full TypeScript support.
- `is_object` intentionally excludes arrays, `Set`, and `Map`.
