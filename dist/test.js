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
function is_object(value) {
  if (value == null) return false;
  if (typeof value !== "object" && typeof value !== "function") return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Set) return false;
  if (value instanceof Map) return false;
  return true;
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
      const match = fstr.match(/(\(\) => )(.*)/);
      if ((match == null ? void 0 : match.length) === 3)
        return match[2];
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
function is_string_array(a) {
  if (!Array.isArray(a))
    return false;
  for (const x of a)
    if (typeof x !== "string")
      return false;
  return true;
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
    { v: false, f: () => is_string_array(["hello", 1]) }
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
