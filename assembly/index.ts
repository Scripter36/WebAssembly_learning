// The entry file of your WebAssembly module.
import 'allocator/tlsf'
// @ts-ignore
export { memory }

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function factorial(a: i32): i32 {
  let result: i32 = 1
  if (a === 1 || a === 0) return 1
  else if (a < 0) return -1
  for (let i: i32 = 2; i <= a; i++) {
    result *= i
  }
  return result
}

export function sum(arr: Int32Array): i32 {
  var v = 0;
  for (let i = 0, k = arr.length; i < k; ++i) v += arr[i];
  return v;
}