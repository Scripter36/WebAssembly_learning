import 'allocator/arena'
// @ts-ignore
export { memory }

declare namespace console {
  // @ts-ignore 정말 없애버리고 싶지만 디버그 때문에 만듬
  @external("console", "log")
  export function log(s: i32): void
}

let chunk: Uint32Array

function getBlock (x: u8, y: u8, z: u8): u32 {
  return chunk[x << 12 + z << 8 + y]
}

export function mergeFace (faces: Uint32Array, width: u16, height: u16): Uint32Array {
  let startX: u8 = 0
  let startY: u8 = 0
  let searchX: u8 = 0
  let searchY: u8 = 0
  let searchingX: bool = true
  let id: u32 = 0
  let result = new Uint32Array(faces.length * 4)
  let nextIndex = 0
  for (let i: i32 = 0; i < faces.length; i++) {
    if (faces[i] !== 0) {
      id = faces[i]
      startY = <u8> (i / width) | 0 // Force Integer
      searchY = startY
      startX = <u8> (i - startY * width)
      searchX = startX
      break
    }
  }
  if (id === 0) return result
  while (true) {
    if (searchingX) {
      if (searchX === width - 1) {
        searchingX = false
        continue
      }
      searchX++
      if (faces[startY * width + searchX] !== id) {
        searchX--
        searchingX = false
        continue
      }
    } else {
      let found: bool = false
      if (searchY === height - 1) {
        found = true
      }
      searchY++
      if (!found) {
        for (let x: u8 = startX; x <= searchX; x++) {
          if (faces[searchY * width + searchX] !== id) {
            found = true
            break
          }
        }
      }
      if (found) {
        searchY--
        result[nextIndex] = startX
        result[nextIndex + 1] = startY
        result[nextIndex + 2] = searchX
        result[nextIndex + 3] = searchY
        nextIndex += 4
        let findX: u8 = startX
        let findY: u8 = startY
        while (true) {
          if (findX === width - 1) {
            findX = 0
            if (findY === height - 1) {
              findY = 0
              break
            }
            findY++
          } else {
            findX++
          }
          let contains = false
          for (let i: i32 = 0; i < result.length; i += 4) {
            if (result[i] <= findX && findX <= result[i + 2] && result[i + 1] <= findY && findY <= result[i + 3]) {
              contains = true
              break
            }
          }
          if (!contains && faces[findX + findY * width] !== 0) break
        }
        if (findX === 0 && findY === 0) {
          break
        } else {
          startX = findX
          searchX = findX
          startY = findY
          searchY = findY
          id = faces[startX + startY * width]
          searchingX = true
        }
      }
    }
  }
  return result.subarray(0, nextIndex)
}

export function optimize (data: Uint32Array): Uint32Array {
  chunk = data
  for (let x: u8 = 0; x <= 0; x++) {
    let frontFace = new Uint32Array(4096)
    let backFace = new Uint32Array(4096)
    for (let y: u8 = 0; y <= 255; y++) {
      for (let z: u8 = 0; z <= 15; z++) {
        let block = getBlock(x, y, z)
        let frontBlock = x === 15 ? 0 : getBlock(x + 1, y, z)
        if (frontBlock === 0) {
          frontFace[z << 8 + y] = block
        }
        let backBlock = x === 0 ? 0 : getBlock(x - 1, y, z)
        if (backBlock === 0) {
          backFace[z << 8 + y] = block
        }
      }
    }
    return mergeFace(frontFace, 16, 256)
  }
  return new Uint32Array(0)
}
