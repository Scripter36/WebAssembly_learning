import 'allocator/arena'
// @ts-ignore
export { memory }

let chunk: u32[]

function getBlock (x: u8, y: u8, z: u8): u32 {
  return chunk[x << 12 + z << 8 + y]
}

export function optimize (data: u32[]): u32[] {
  chunk = data
  let result = 0
  let frontFace: u32[] = []
  for (let x: u8 = 0; x <= 0; x++) {
    for (let y: u8 = 0; y <= 255; y++) {
      for (let z: u8 = 0; z <= 15; z++) {
        let block = getBlock(x, y, z)
        let frontBlock = x === 15 ? 0 : getBlock(x + 1, y, z)
        if (frontBlock === 0) {
          frontFace[z << 8 + y] = block
          result++
        }
      }
    }
  }
  return frontFace
}
