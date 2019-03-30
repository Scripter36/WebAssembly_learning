const fs = require('fs')
var source = fs.readFileSync('./build/optimized.wasm')
const env = {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({
      initial: 256
    }),
    table: new WebAssembly.Table({
      initial: 0,
      element: 'anyfunc'
    })
  }

var typedArray = new Uint8Array(source)

WebAssembly.instantiate(typedArray, {
  env: env
}).then(result => {
  console.log(result.instance.exports.add(9, 9))
}).catch(e => {
  // error caught
  console.log(e)
})
