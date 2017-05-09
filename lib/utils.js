'use babel'

const doubleDidget = (num) => {
  return ("0" + num).slice(-2);
}

export default {

  /**
   * format ms as HH:MM:SS
   *
   * @param  {Number} secs - number of seconds
   * @returns {String} Formatted seconds
   */
  formattedSeconds(secs) {
    let hours = Math.floor(secs / 60 / 60);
    secs = secs - hours * (60*60);
    let minutes = Math.floor(secs / 60);
    secs = secs - minutes * 60;

    return `${doubleDidget(hours)}:${doubleDidget(minutes)}:${doubleDidget(secs)}`;
  },

  /**
   * normalize spacing at start of lines
   *
   * @param  {String} code - code to be normalized
   * @returns {String} Normalized code
   */
  normalizeSpacing(code) {

    // TODO: handle windows line endings
    let lines = code.split('\n')

    // count spaces at start of lines
    let spaceCounts = lines.filter((line) => {
      // filter out blanks
      return !line.match(/^\s*$/)
    }).map((line) => {
      let match = line.match(/^\s+/)
      return match ? match[0].length : 0
    })

    let minSpaces = Math.min.apply(this, spaceCounts)

    // remove excess spaces
    let regex = new RegExp(`^\\s{${minSpaces}}`)
    let cleaned = lines.map((line) => {
      return line.replace(regex, '')
    })

    // TODO: join with proper line ending
    return cleaned.join('\n')
  }
}
