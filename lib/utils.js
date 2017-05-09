'use babel'

const doubleDidget = (num) => {
  return ("0" + num).slice(-2);
}

export default {
  formattedSeconds(secs) {
    let hours = Math.floor(secs / 60 / 60);
    secs = secs - hours * (60*60);
    let minutes = Math.floor(secs / 60);
    secs = secs - minutes * 60;

    return `${doubleDidget(hours)}:${doubleDidget(minutes)}:${doubleDidget(secs)}`;
  },


  /**
   * normalize spacing at start of lines
   */
  normalizeSpacing(code) {

    let lines = code.split('\n')

    // count spaces at start of each line
    let spaceCounts = lines.map((line) => {
      let match = line.match(/^\s+/)

      return match ? match[0].length : 0
    })

    let minSpaces = Math.min.apply(this, spaceCounts)

    // remove excess spaces
    let regex = new RegExp(`^\\s{${minSpaces}}`)

    let cleaned = lines.map((line) => {
      return line.replace(regex, '')
    })

    // join
    return cleaned.join('\n')
  }
}
