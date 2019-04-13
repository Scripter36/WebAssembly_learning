/// <reference path="../types/webassembly.d.ts" />

const loader = require('assemblyscript/lib/loader')
const fs = require('fs')

const assemblyModule = loader.instantiateBuffer(fs.readFileSync('./build/untouched.wasm'), {
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
const array = new Uint32Array(65536)
for (let i = 0; i < 65536; i++) array[i] = 1
const ptr = assemblyModule.newArray(array)
console.log(assemblyModule.getArray(Uint32Array, assemblyModule.optimize(ptr)))
