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
function is_object(value) {
  if (value == null || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Date) return false;
  if (value instanceof RegExp) return false;
  if (value instanceof Set) return false;
  if (value instanceof Map) return false;
  if (value instanceof Function) return false;
  return true;
}

// src/test.ts
var Hello = class {
  constructor() {
    console.log("making Hello");
  }
};
function runTests() {
  let passed = 0;
  let failed = 0;
  function test(name, condition) {
    if (condition) {
      console.log(`\u2705 ${name}`);
      passed++;
    } else {
      console.log(`\u274C ${name}`);
      failed++;
    }
  }
  console.log("Running is_object tests...\n");
  test("class instance should return true", is_object(new Hello()));
  test("Set should return false", !is_object(/* @__PURE__ */ new Set()));
  test("Function should return false", !is_object(() => {
  }));
  test("Array should return false", !is_object([1, 2, 3]));
  test("Number atom should return false", !is_object(42));
  test("String atom should return false", !is_object("hello"));
  test("Boolean atom should return false", !is_object(true));
  test("null should return false", !is_object(null));
  test("undefined should return false", !is_object(void 0));
  test("Date should return false", !is_object(/* @__PURE__ */ new Date()));
  test("RegExp should return false", !is_object(/test/));
  test("Map should return false", !is_object(/* @__PURE__ */ new Map()));
  test("Plain object should return true", is_object({}));
  test("Plain object with properties should return true", is_object({ a: 1, b: "test" }));
  test("Object created with Object.create should return true", is_object(/* @__PURE__ */ Object.create({})));
  console.log(`
Test Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log("\u{1F389} All tests passed!");
    return true;
  } else {
    console.log("\u{1F4A5} Some tests failed!");
    return false;
  }
}
if (typeof require !== "undefined" && require.main === module) {
  runTests();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runTests
});
//# sourceMappingURL=test.js.map
