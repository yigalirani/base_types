import { is_object, pk,run_tests,type Test } from './index'
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
  }}
  ]
  await run_tests(...tests)
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  void runTests()
}


