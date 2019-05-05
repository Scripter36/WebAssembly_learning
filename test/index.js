/// <reference path="../types/webassembly.d.ts" />

const loader = require('assemblyscript/lib/loader')
const fs = require('fs')

const assemblyModule = loader.instantiateBuffer(fs.readFileSync('./build/untouched.wasm'), {
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
    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
    abort: console.log
  }
})
const testAmount = 1000
const array = new Uint32Array(65536)
for (let i = 0; i < 65536; i++) array[i] = Math.floor(Math.random() * 65536)
const ptr = assemblyModule.newArray(array)
const before = process.hrtime()
for (let i = 0; i < testAmount; i++) {
  assemblyModule.optimize(ptr);
  assemblyModule.memory.reset() // TODO: fix memory leak
}
const after = process.hrtime()
console.log(`RESULT >> ${(after[0] * 1000 + after[1] / 1000000 - before[0] * 1000 - before[1] / 1000000) / testAmount}ms`) // only about 45ms with 1,048,576 faces!!!
/*
const vertices = assemblyModule.getArray(Uint32Array, assemblyModule.getVertices())
const faces = assemblyModule.getArray(Uint32Array, assemblyModule.getFaces())

for (let i = 0; i < vertices.length; i += 3) {
  console.log(`${vertices[i]}, ${vertices[i + 1]}, ${vertices[i + 2]}`)
}

console.log('='.repeat(10))

for (let i = 0; i < faces.length; i += 3) {
  console.log(`${faces[i]}, ${faces[i + 1]}, ${faces[i + 2]}`)
}
*/
