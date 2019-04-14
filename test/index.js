/// <reference path="../types/webassembly.d.ts" />

const loader = require('assemblyscript/lib/loader')
const fs = require('fs')

const assemblyModule = loader.instantiateBuffer(fs.readFileSync('./build/untouched.wasm'), {
  console: {
    log: (msg) => {
      console.log(`WASM >> ${msg}`);
    }
  },
  env: {
    memory: new WebAssembly.Memory({ initial: 256 }),
    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
  }
})
const array = new Uint32Array(65536)
for (let i = 0; i < 65536; i++) array[i] = Math.floor(Math.random() * 3)
const ptr = assemblyModule.newArray(array)
const previous = Date.now()
const result = assemblyModule.getArray(Uint32Array, assemblyModule.mergeFace(ptr, 256, 256))
const next = Date.now()
console.log(`estimated time: ${next - previous}ms`) // 65536 faces: 30038ms. too slow
for (let i = 0; i < result.length; i += 4) {
  console.log(`${result[i]}, ${result[i + 1]}, ${result[i + 2]}, ${result[i + 3]}`)
}
/**
 * Result
 * 0, 0, 3, 0
 * 0, 1, 1, 1
 * 2, 1, 3, 3
 * 0, 2, 3, 3
 */
