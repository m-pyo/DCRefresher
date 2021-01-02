const str = (window.chrome && window.chrome.storage) || window.storage

export const set = (key: string, value: any) => {
  if (!str) {
    throw new Error("This browser doesn't support storage API.")
  }

  let obj = {}
  obj[key] = value

  return str.sync.set(obj)
}

export const get = (key: any) => {
  if (!str) {
    throw new Error("This browser doesn't support storage API.")
  }

  return new Promise<any>((resolve, reject) =>
    str.sync.get(key, (v: any) => {
      resolve(v[key])
    })
  )
}

export const load = () => {}
