export const rand = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export const uuid = () => {
  return (
    rand() +
    rand() +
    '-' +
    rand() +
    '-' +
    rand() +
    '-' +
    rand() +
    '-' +
    rand() +
    rand() +
    rand()
  )
}
