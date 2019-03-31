/// <reference path="../types/webassembly.d.ts" />

const loader = require('assemblyscript/lib/loader')
const fs = require('fs')

const assemblyModule = loader.instantiateBuffer(fs.readFileSync('./build/optimized.wasm'), {
  memoryBase: 0,
  tableBase: 0,
  memory: new WebAssembly.Memory({
    initial: 256
  }),
  table: new WebAssembly.Table({
    initial: 0,
    element: 'anyfunc'
  })
})

console.log(assemblyModule.add(assemblyModule.factorial(11), assemblyModule.factorial(13)))
console.log(assemblyModule.factorial(15))
const ptr = assemblyModule.newArray(new Int32Array([1, 2, 3]))
console.log(assemblyModule.sum(ptr))
