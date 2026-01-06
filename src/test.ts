import { 
  is_object, 
  pk, 
  run_tests, 
  type Test, 
  is_string_array, 
  sleep,
  is_promise,
  resolve_maybe_promise,
  getCommonPrefix,
  default_get,
  has_keys,
  has_key,
  is_atom,
  is_key,
  nl,
  get_error,
  objects_only
} from './index'

class Hello{
  constructor(){
    console.log('making Hello')
  }
}
function createSimplePromise(shouldSucceed: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation, e.g., a network request or a timer
    setTimeout(() => {
      if (shouldSucceed) {
        resolve("Operation successful!"); // Resolve the promise with a success value
      } else {
        reject(new Error("Operation failed!")); // Reject the promise with an error
      }
    }, 1000); // Simulate a 1-second delay
  });
}  
type UserOpt = { id: number; name?: string }

// Test function to run all tests
async function testSleep() {
  console.log("Test started...");

  const start = Date.now();
  await sleep(1000); // sleep for 1 second
  const end = Date.now();

  console.log(`Slept for ${end - start} ms`);
  console.log("Test finished.");
  return Math.abs(end-start-1000)<100
}

export async function runTests() {
  const tests:Test[]=[
  {k:'class instance',f:()=> is_object(new Hello())},
  {k:'Set',v:false,f:()=> is_object(new Set())},
  {k:'Function',f:()=> is_object(() => {})},
  {k:'Array',v:false,f:()=> is_object([1, 2, 3])},
  {k:'Number atom',v:false,f:()=> is_object(42)},
  {k:'String atom',v:false,f:()=> is_object('hello')},
  {k:'Boolean atom',f:()=> !is_object(true)},
  {k:'null',v:false,f:()=> is_object(null)},
  {k:'undefined',v:false,f:()=> is_object(undefined)},
  {k:'Date',f:()=> is_object(new Date())},
  {k:'RegExp',f:()=> is_object(/test/)},
  {k:'Map',v:false,f:()=> is_object(new Map())},
  {k:'Promise',f:()=> is_object(createSimplePromise(true))},
  // Test cases that should return true
  {k:'Plain object',f:()=> is_object({})},
  {k:'Plain object with properties',f:()=> is_object({ a: 1, b: 'test' })},
  {k:'Object created with Object.create',f:()=> is_object(Object.create({}))},
  {k:'pk picks single key',f:()=>{
    const user = { id: 7, name: 'Ada', active: true }
    const pickId = pk(user, 'id')
    return pickId.id === 7
  }},
  {k:'pk picks multiple keys', f:()=>{
    const user = { id: 7, name: 'Ada', active: true }
    const pickTwo = pk(user, 'id', 'name')
    return pickTwo.id === 7 && pickTwo.name === 'Ada'
  }},
  {k:'pk returns undefined for missing optional key',f:()=>{
    const userOpt: UserOpt = { id: 1 }
    const pickOptional = pk(userOpt, 'name')
    return pickOptional.name === undefined
  }},
  {k:'pk works with undefined source, values undefined',f:()=>{
    const pickFromUndefined = pk<UserOpt, 'id' | 'name'>(undefined, 'id', 'name')    
    return pickFromUndefined.id === undefined && pickFromUndefined.name === undefined
  }},
  {v:false,f:()=>is_string_array(null)},
  {v:false,f:()=>is_string_array({})},
  {v:true,f:()=>is_string_array([])},
  {v:true,f:()=>is_string_array(['hello'])},
  {v:true,f:()=>is_string_array(['hello','1'])},
  {v:false,f:()=>is_string_array(['hello',1])},
  {v:true,f:testSleep},
  // is_promise tests
  {k:'is_promise with Promise',f:()=>is_promise(createSimplePromise(true))},
  {k:'is_promise with non-Promise object',v:false,f:()=>is_promise({})},
  {k:'is_promise with thenable object',f:()=>is_promise({then:()=>{}})},
  {k:'is_promise with null',v:false,f:()=>is_promise(null)},
  {k:'is_promise with string',v:false,f:()=>is_promise('test')},
  // resolve_maybe_promise tests
  {k:'resolve_maybe_promise with value',f:async()=>{
    const result = await resolve_maybe_promise(42)
    return result === 42
  }},
  {k:'resolve_maybe_promise with Promise',f:async()=>{
    const result = await resolve_maybe_promise(Promise.resolve('success'))
    return result === 'success'
  }},
  // getCommonPrefix tests
  {k:'getCommonPrefix empty array',f:()=>getCommonPrefix([])===''},
  {k:'getCommonPrefix single path',f:()=>getCommonPrefix(['a/b/c'])==='a/b/c'},
  {k:'getCommonPrefix common prefix',f:()=>getCommonPrefix(['a/b/c','a/b/d'])==='a/b'},
  {k:'getCommonPrefix no common prefix',f:()=>getCommonPrefix(['a/b','c/d'])===''},
  {k:'getCommonPrefix windows paths',f:()=>getCommonPrefix(['a\\b\\c','a\\b\\d'])==='a/b'},
  // default_get tests
  {k:'default_get existing key',f:()=>{
    const obj = {a:1}
    return default_get(obj,'a',()=>2) === 1
  }},
  {k:'default_get missing key',f:()=>{
    const obj:Record<string,number> = {}
    const result = default_get(obj,'a',()=>42)
    return result === 42 && obj.a === 42
  }},
  // has_keys tests
  {v:false,k:'has_keys with matching key',f:()=>has_keys({a:1,b:2},['a','c'])},
  {k:'has_keys with no matching key',v:false,f:()=>has_keys({a:1,b:2},['c','d'])},
  {k:'has_keys with non-object',v:false,f:()=>has_keys(null,['a'])},
  // has_key tests
  {k:'has_key with existing key',f:()=>has_key({a:1},'a')},
  {k:'has_key with missing key',v:false,f:()=>has_key({a:1},'b')},
  {k:'has_key with non-object',v:false,f:()=>has_key(null,'a')},
  // is_atom tests
  {k:'is_atom with number',f:()=>is_atom(42)},
  {k:'is_atom with string',f:()=>is_atom('hello')},
  {k:'is_atom with boolean',f:()=>is_atom(true)},
  {k:'is_atom with null',v:false,f:()=>is_atom(null)},
  {k:'is_atom with object',v:false,f:()=>is_atom({})},
  // is_key tests
  {k:'is_key with number',f:()=>is_key(42)},
  {k:'is_key with string',f:()=>is_key('hello')},
  {k:'is_key with boolean',v:false,f:()=>is_key(true)},
  {k:'is_key with null',v:false,f:()=>is_key(null)},
  // nl tests
  {k:'nl with value',f:()=>nl(42)===42},
  {k:'nl with null throws',f:()=>{
    try {
      nl(null)
      return false
    } catch {
      return true
    }
  }},
  {k:'nl with undefined throws',f:()=>{
    try {
      nl(undefined)
      return false
    } catch {
      return true
    }
  }},
  // get_error tests
  {k:'get_error with Error',f:()=>get_error(new Error('test')) instanceof Error},
  {k:'get_error with string',f:()=>get_error('test') instanceof Error},
  {k:'get_error with number',f:()=>get_error(42) instanceof Error},
  // objects_only tests
  {k:'objects_only filters objects',f:()=>{
    const arr = [1,{a:1},'test',{b:2},null]
    const objects = Array.from(objects_only(arr))
    return objects.length === 2 && objects[0].a === 1 && objects[1].b === 2
  }}
  ]
  await run_tests(...tests)
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  void runTests()
}


