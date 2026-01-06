"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/test.ts
var test_exports = {};
__export(test_exports, {
  runTests: () => runTests
});
module.exports = __toCommonJS(test_exports);

// src/index.ts
var green = "\x1B[40m\x1B[32m";
var red = "\x1B[40m\x1B[31m";
var yellow = "\x1B[40m\x1B[33m";
var reset = "\x1B[0m";
function nl(value) {
  if (value === null || value === void 0) {
    throw new Error("Value cannot be null or undefined");
  }
  return value;
}
function is_atom(x) {
  if (x == null) return false;
  return ["number", "string", "boolean"].includes(typeof x);
}
function is_key(x) {
  if (x == null) return false;
  return ["number", "string"].includes(typeof x);
}
function get_error(x) {
  if (x instanceof Error)
    return x;
  const str = String(x);
  return new Error(str);
}
function is_object(value) {
  if (value == null) return false;
  if (typeof value !== "object" && typeof value !== "function") return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Set) return false;
  if (value instanceof Map) return false;
  return true;
}
function has_key(obj, k) {
  if (!is_object(obj)) return false;
  return k in obj;
}
function* objects_only(ar) {
  for (const item of ar)
    if (is_object(item))
      yield item;
}
function has_keys(obj, keys) {
  if (!is_object(obj)) return false;
  for (const k of keys) if (k in keys) return true;
  return false;
}
function pk(obj, ...keys) {
  const ret = {};
  keys.forEach((key) => {
    ret[key] = obj == null ? void 0 : obj[key];
  });
  return ret;
}
function is_promise(value) {
  if (!is_object(value))
    return false;
  const ans = typeof value.then === "function";
  return ans;
}
async function resolve_maybe_promise(a) {
  if (is_promise(a))
    return await a;
  return a;
}
async function run_tests(...tests) {
  let passed = 0;
  let failed = 0;
  for (const { k, v, f } of tests) {
    const ek = (function() {
      if (k != null)
        return k;
      const fstr = String(f);
      {
        const match = fstr.match(/(\(\) => )(.*)/);
        if ((match == null ? void 0 : match.length) === 3)
          return match[2];
      }
      {
        const match = fstr.match(/function\s(\w+)/);
        if ((match == null ? void 0 : match.length) === 2)
          return match[1];
      }
      return;
    })();
    try {
      const ret = f();
      const effective_v = v != null ? v : true;
      const resolved = await resolve_maybe_promise(ret);
      if (resolved === effective_v) {
        console.log(`\u2705 ${ek}: ${green}${effective_v}${reset}`);
        passed++;
      } else {
        console.error(`\u274C ${ek}:expected ${yellow}${effective_v}${reset}, got ${red}${resolved}${reset}`);
        failed++;
      }
    } catch (err) {
      console.error(`\u{1F4A5} ${ek} threw an error:`, err);
      failed++;
    }
  }
  if (failed === 0)
    console.log(`
Summary:  all ${passed} passed`);
  else
    console.log(`
Summary:  ${failed} failed, ${passed} passed`);
}
function getCommonPrefix(paths) {
  if (paths.length === 0) return "";
  if (paths.length === 1) return paths[0];
  const splitPaths = paths.map((p) => p.split(/[\\/]+/));
  const commonParts = [];
  const first = splitPaths[0];
  for (let i = 0; i < first.length; i++) {
    const part = first[i];
    if (splitPaths.every((p) => p[i] === part)) {
      commonParts.push(part);
    } else {
      break;
    }
  }
  return commonParts.join("/");
}
function is_string_array(a) {
  if (!Array.isArray(a))
    return false;
  for (const x of a)
    if (typeof x !== "string")
      return false;
  return true;
}
async function sleep(ms) {
  return await new Promise((resolve) => {
    setTimeout(() => resolve(void 0), ms);
  });
}
function default_get(obj, k, maker) {
  const exists = obj[k];
  if (exists == null) {
    obj[k] = maker();
  }
  return obj[k];
}

// src/test.ts
var Hello = class {
  constructor() {
    console.log("making Hello");
  }
};
function createSimplePromise(shouldSucceed) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve("Operation successful!");
      } else {
        reject(new Error("Operation failed!"));
      }
    }, 1e3);
  });
}
async function testSleep() {
  console.log("Test started...");
  const start = Date.now();
  await sleep(1e3);
  const end = Date.now();
  console.log(`Slept for ${end - start} ms`);
  console.log("Test finished.");
  return Math.abs(end - start - 1e3) < 100;
}
async function runTests() {
  const tests = [
    { k: "class instance", f: () => is_object(new Hello()) },
    { k: "Set", v: false, f: () => is_object(/* @__PURE__ */ new Set()) },
    { k: "Function", f: () => is_object(() => {
    }) },
    { k: "Array", v: false, f: () => is_object([1, 2, 3]) },
    { k: "Number atom", v: false, f: () => is_object(42) },
    { k: "String atom", v: false, f: () => is_object("hello") },
    { k: "Boolean atom", f: () => !is_object(true) },
    { k: "null", v: false, f: () => is_object(null) },
    { k: "undefined", v: false, f: () => is_object(void 0) },
    { k: "Date", f: () => is_object(/* @__PURE__ */ new Date()) },
    { k: "RegExp", f: () => is_object(/test/) },
    { k: "Map", v: false, f: () => is_object(/* @__PURE__ */ new Map()) },
    { k: "Promise", f: () => is_object(createSimplePromise(true)) },
    // Test cases that should return true
    { k: "Plain object", f: () => is_object({}) },
    { k: "Plain object with properties", f: () => is_object({ a: 1, b: "test" }) },
    { k: "Object created with Object.create", f: () => is_object(/* @__PURE__ */ Object.create({})) },
    { k: "pk picks single key", f: () => {
      const user = { id: 7, name: "Ada", active: true };
      const pickId = pk(user, "id");
      return pickId.id === 7;
    } },
    { k: "pk picks multiple keys", f: () => {
      const user = { id: 7, name: "Ada", active: true };
      const pickTwo = pk(user, "id", "name");
      return pickTwo.id === 7 && pickTwo.name === "Ada";
    } },
    { k: "pk returns undefined for missing optional key", f: () => {
      const userOpt = { id: 1 };
      const pickOptional = pk(userOpt, "name");
      return pickOptional.name === void 0;
    } },
    { k: "pk works with undefined source, values undefined", f: () => {
      const pickFromUndefined = pk(void 0, "id", "name");
      return pickFromUndefined.id === void 0 && pickFromUndefined.name === void 0;
    } },
    { v: false, f: () => is_string_array(null) },
    { v: false, f: () => is_string_array({}) },
    { v: true, f: () => is_string_array([]) },
    { v: true, f: () => is_string_array(["hello"]) },
    { v: true, f: () => is_string_array(["hello", "1"]) },
    { v: false, f: () => is_string_array(["hello", 1]) },
    { v: true, f: testSleep },
    // is_promise tests
    { k: "is_promise with Promise", f: () => is_promise(createSimplePromise(true)) },
    { k: "is_promise with non-Promise object", v: false, f: () => is_promise({}) },
    { k: "is_promise with thenable object", f: () => is_promise({ then: () => {
    } }) },
    { k: "is_promise with null", v: false, f: () => is_promise(null) },
    { k: "is_promise with string", v: false, f: () => is_promise("test") },
    // resolve_maybe_promise tests
    { k: "resolve_maybe_promise with value", f: async () => {
      const result = await resolve_maybe_promise(42);
      return result === 42;
    } },
    { k: "resolve_maybe_promise with Promise", f: async () => {
      const result = await resolve_maybe_promise(Promise.resolve("success"));
      return result === "success";
    } },
    // getCommonPrefix tests
    { k: "getCommonPrefix empty array", f: () => getCommonPrefix([]) === "" },
    { k: "getCommonPrefix single path", f: () => getCommonPrefix(["a/b/c"]) === "a/b/c" },
    { k: "getCommonPrefix common prefix", f: () => getCommonPrefix(["a/b/c", "a/b/d"]) === "a/b" },
    { k: "getCommonPrefix no common prefix", f: () => getCommonPrefix(["a/b", "c/d"]) === "" },
    { k: "getCommonPrefix windows paths", f: () => getCommonPrefix(["a\\b\\c", "a\\b\\d"]) === "a/b" },
    // default_get tests
    { k: "default_get existing key", f: () => {
      const obj = { a: 1 };
      return default_get(obj, "a", () => 2) === 1;
    } },
    { k: "default_get missing key", f: () => {
      const obj = {};
      const result = default_get(obj, "a", () => 42);
      return result === 42 && obj.a === 42;
    } },
    // has_keys tests
    { v: false, k: "has_keys with matching key", f: () => has_keys({ a: 1, b: 2 }, ["a", "c"]) },
    { k: "has_keys with no matching key", v: false, f: () => has_keys({ a: 1, b: 2 }, ["c", "d"]) },
    { k: "has_keys with non-object", v: false, f: () => has_keys(null, ["a"]) },
    // has_key tests
    { k: "has_key with existing key", f: () => has_key({ a: 1 }, "a") },
    { k: "has_key with missing key", v: false, f: () => has_key({ a: 1 }, "b") },
    { k: "has_key with non-object", v: false, f: () => has_key(null, "a") },
    // is_atom tests
    { k: "is_atom with number", f: () => is_atom(42) },
    { k: "is_atom with string", f: () => is_atom("hello") },
    { k: "is_atom with boolean", f: () => is_atom(true) },
    { k: "is_atom with null", v: false, f: () => is_atom(null) },
    { k: "is_atom with object", v: false, f: () => is_atom({}) },
    // is_key tests
    { k: "is_key with number", f: () => is_key(42) },
    { k: "is_key with string", f: () => is_key("hello") },
    { k: "is_key with boolean", v: false, f: () => is_key(true) },
    { k: "is_key with null", v: false, f: () => is_key(null) },
    // nl tests
    { k: "nl with value", f: () => nl(42) === 42 },
    { k: "nl with null throws", f: () => {
      try {
        nl(null);
        return false;
      } catch {
        return true;
      }
    } },
    { k: "nl with undefined throws", f: () => {
      try {
        nl(void 0);
        return false;
      } catch {
        return true;
      }
    } },
    // get_error tests
    { k: "get_error with Error", f: () => get_error(new Error("test")) instanceof Error },
    { k: "get_error with string", f: () => get_error("test") instanceof Error },
    { k: "get_error with number", f: () => get_error(42) instanceof Error },
    // objects_only tests
    { k: "objects_only filters objects", f: () => {
      const arr = [1, { a: 1 }, "test", { b: 2 }, null];
      const objects = Array.from(objects_only(arr));
      return objects.length === 2 && objects[0].a === 1 && objects[1].b === 2;
    } }
  ];
  await run_tests(...tests);
}
if (typeof require !== "undefined" && require.main === module) {
  void runTests();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runTests
});
//# sourceMappingURL=test.js.map
