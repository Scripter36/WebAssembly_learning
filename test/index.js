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
const array = new Uint32Array(1048576)
for (let i = 0; i < 1048576; i++) array[i] = Math.floor(Math.random() * 2)
const ptr = assemblyModule.newArray(array)
const before = process.hrtime()
console.log(`MARK >> ${before[0] * 1000 + before[1] / 1000000}`)
const result = assemblyModule.getArray(Uint32Array, assemblyModule.mergeFace(ptr, 1024, 1024))
const after = process.hrtime()
console.log(`MARK >> ${after[0] * 1000 + after[1] / 1000000}`)
console.log(`RESULT >> ${after[0] * 1000 + after[1] / 1000000 - before[0] * 1000 - before[1] / 1000000}ms`) // only about 45ms with 1,048,576 faces!!!
for (let i = 0; i < result.length; i += 4) {
  // console.log(`${result[i]}, ${result[i + 1]}, ${result[i + 2]}, ${result[i + 3]}`)
}
