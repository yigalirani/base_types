import { is_object, pk } from './index'
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
// Test function to run all tests
export function runTests() {
  let passed = 0
  let failed = 0

  
  function test(name: string, condition: boolean) {
    if (condition) {
      console.log(`✅ ${name}`)
      passed++
    } else {
      console.log(`❌ ${name}`)
      failed++
    }
  }
  console.log('Running is_object tests...\n')

  // Test cases that should return false
  test('class instance should return true', is_object(new Hello()))
  test('Set should return false', !is_object(new Set()))
  test('Function should return true', is_object(() => {}))
  test('Array should return false', !is_object([1, 2, 3]))
  test('Number atom should return false', !is_object(42))
  test('String atom should return false', !is_object('hello'))
  test('Boolean atom should return false', !is_object(true))
  test('null should return false', !is_object(null))
  test('undefined should return false', !is_object(undefined))
  test('Date should return true', is_object(new Date()))
  test('RegExp should return true', is_object(/test/))
  test('Map should return false', !is_object(new Map()))
  test('Promise should return True', is_object(createSimplePromise(true)))
  // Test cases that should return true
  test('Plain object should return true', is_object({}))
  test('Plain object with properties should return true', is_object({ a: 1, b: 'test' }))
  test('Object created with Object.create should return true', is_object(Object.create({})))

  // pk tests
  console.log('\nRunning pk tests...\n')
  const user = { id: 7, name: 'Ada', active: true }
  const pickId = pk(user, 'id')
  test('pk picks single key', pickId.id === 7)

  const pickTwo = pk(user, 'id', 'name')
  test('pk picks multiple keys', pickTwo.id === 7 && pickTwo.name === 'Ada')

  type UserOpt = { id: number; name?: string }
  const userOpt: UserOpt = { id: 1 }
  const pickOptional = pk(userOpt, 'name')
  test('pk returns undefined for missing optional key', pickOptional.name === undefined)

  const pickFromUndefined = pk<UserOpt, 'id' | 'name'>(undefined, 'id', 'name')
  test('pk works with undefined source, values undefined', pickFromUndefined.id === undefined && pickFromUndefined.name === undefined)

  console.log(`\nTest Results: ${passed} passed, ${failed} failed`)
  
  if (failed === 0) {
    console.log('🎉 All tests passed!')
    return true
  } else {
    console.log('💥 Some tests failed!')
    return false
  }
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runTests()
}


