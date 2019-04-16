/// <reference path="../types/webassembly.d.ts" />

const loader = require('assemblyscript/lib/loader')
const fs = require('fs')

const assemblyModule = loader.instantiateBuffer(fs.readFileSync('./build/optimized.wasm'), {
  console: {
    log: (msg) => {
      console.log(`WASM >> ${msg}`);
    },
    time: () => {
      console.log(`MARK >> ${process.hrtime()[1] / 1000000}`)
    }
  },
  env: {
    memory: new WebAssembly.Memory({ initial: 256 }),
    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
  }
})
const array = new Uint32Array(65536)
for (let i = 0; i < 65536; i++) array[i] = Math.floor(Math.random() * 2)
const ptr = assemblyModule.newArray(array)
const before = process.hrtime()[1] / 1000000
console.log(`MARK >> ${before}`)
const result = assemblyModule.getArray(Uint32Array, assemblyModule.mergeFace(ptr, 256, 256))
const after = process.hrtime()[1] / 1000000
console.log(`MARK >> ${after}`)
console.log(`RESULT >> ${after - before}ms`) // 7ms!!!!
for (let i = 0; i < result.length; i += 4) {
  // console.log(`${result[i]}, ${result[i + 1]}, ${result[i + 2]}, ${result[i + 3]}`)
}
/**
 * Result
 * 0, 0, 3, 0
 * 0, 1, 1, 1
 * 2, 1, 3, 3
 * 0, 2, 3, 3
 */
