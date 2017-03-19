'use babel'

const API_URL = 'https://amnesia.io/api';
const MSG_SUCCESS = 'Amnesia.io share link copied to clipboard';
const MSG_ERROR = 'Select some text to share on amnesia.io, and then try again';
const MSG_AJAX_ERROR = 'Unable to connect to amnesia.io'

const getConfiguredFileFormat = () => {
  return atom.config.get('amnesia-io.defaultFormat');
}

const getConfiguredTTL = () => {
  return atom.config.get('amnesia-io.ttl');
}

/**
 * shareCode - post code to amnesia.io
 *
 * @private
 * @param {string} code - code to share
 * @param {string} format - format for syntax highlighting
 */
const shareCode = (code, format) => {

  let request = new XMLHttpRequest();
  let payload = {
    code: code,
    format: format,
    ttl: getConfiguredTTL()
  };

  request.addEventListener('readystatechange', () => {
    if(request.status.toString().match(/2[0-9]{1,2}/)) {
      atom.notifications.addSuccess(MSG_SUCCESS);
      atom.clipboard.write('URL2share')
    }
  });

  request.addEventListener('error', () => {
    atom.notifications.addError(MSG_AJAX_ERROR);
  });

  request.open('POST', API_URL);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(payload));
}

/**
 * extension - get file extension from path
 *
 * @private
 * @param {string} path - path to file
 * @returns {string} file extension of path, defaults to `txt` if none
 */
const getExtention = (path) => {
  let extension = path.match(/\.([0-9a-z]+$)/i);
  return !!extension? extension[1] : getConfiguredFileFormat();
}

/**
 * file - get open file
 *
 * @private
 * @returns {file} current file
 */
const getFile = () => {
  let editor = atom.workspace.getActivePaneItem();
  return editor.buffer.file;
}

export default {
  shareBlock: function() {
    let editor = atom.workspace.getActivePaneItem();
    let range = editor.getCurrentParagraphBufferRange();
    let block = editor.getTextInRange(range);

    shareCode(block, getExtention(getFile().path));
  },

  shareSelection: function() {
    let editor = atom.workspace.getActivePaneItem();
    let selection = editor.getSelectedText();

    if(selection.length > 0) {
      shareCode(selection, getExtention(getFile().path));
    } else {
      atom.notifications.addError(MSG_ERROR);
    }
  },

  shareFile: function() {
    let file = getFile();
    let path = file.path;
    let code = file.cachedContents;

    shareCode(code, getExtention(path));
  }
}
