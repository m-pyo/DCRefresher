export default (...inputs: any) => {
  inputs.forEach((str: any) => {
    str = typeof str === 'object' ? JSON.stringify(str) : str
  })

  return console.log(
    `🔧 %c${new Date().toLocaleTimeString('en-US')} %c:`,
    `color: #888;`,
    `color: unset;`,
    ...inputs
  )
}
