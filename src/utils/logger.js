module.exports = (str) => {
  return console.log(
    `🔧 %c${new Date().toLocaleTimeString('en-US')} %c: ${
      typeof str === 'object' ? JSON.stringify(str) : str
    }`, `color: #888;`, `color: unset;`
  )
}
