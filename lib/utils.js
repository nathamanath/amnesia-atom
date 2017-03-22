'use babel'

const doubleDidget = (num) => {
  return ("0" + num).slice(-2);
}

export default {
  formattedSeconds: (secs) => {
    let hours = Math.floor(secs / 60 / 60);
    secs = secs - hours * (60*60);
    let minutes = Math.floor(secs / 60);
    secs = secs - minutes * 60;

    return `${doubleDidget(hours)}:${doubleDidget(minutes)}:${doubleDidget(secs)}`;
  }
}
