import { is_object } from './index'

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
  test('Set should return false', !is_object(new Set()))
  test('Function should return false', !is_object(() => {}))
  test('Array should return false', !is_object([1, 2, 3]))
  test('Number atom should return false', !is_object(42))
  test('String atom should return false', !is_object('hello'))
  test('Boolean atom should return false', !is_object(true))
  test('null should return false', !is_object(null))
  test('undefined should return false', !is_object(undefined))
  test('Date should return false', !is_object(new Date()))
  test('RegExp should return false', !is_object(/test/))
  test('Map should return false', !is_object(new Map()))

  // Test cases that should return true
  test('Plain object should return true', is_object({}))
  test('Plain object with properties should return true', is_object({ a: 1, b: 'test' }))
  test('Object created with Object.create should return true', is_object(Object.create({})))

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

