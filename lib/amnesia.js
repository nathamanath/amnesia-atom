'use babel'

import {formattedSeconds, normalizeSpacing} from './utils'

const API_URL = 'https://amnesia.io/api?source=atom';
const MSG_SUCCESS = 'Amnesia.io share link copied to clipboard';
const MSG_EXPIRE = '<br>Your link will expire in'
const MSG_ERROR = 'Select some text to share on amnesia.io, and then try again';
const MSG_AJAX_ERROR = 'Unable to connect to amnesia.io'

const SHARE_TYPES = {
  BLOCK: 'block',
  FILE: 'file',
  LINE: 'line',
  SELECTION: 'selection'
}

const SCOPE_DELIMITER = '\n\n...\n\n';

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
const shareCode = (code, format, shareType) => {

  let request = new XMLHttpRequest();
  let payload = {
    content: normalizeSpacing(code),
    extension: format,
    ttl: getConfiguredTTL()
  };

  request.addEventListener('readystatechange', () => {
    if(request.readyState === 4) {
      if(request.status.toString().match(/2[0-9]{1,2}/)) {
        let response = JSON.parse(request.responseText);
        let url = response.url;
        let ttl = response.ttl;

        let message = MSG_SUCCESS;

        if(ttl) {
          message += `${MSG_EXPIRE} ${formattedSeconds(ttl)}`;
        }

        atom.notifications.addSuccess(message);
        atom.clipboard.write(response.url);
      } else{
        atom.notifications.addError(MSG_AJAX_ERROR);
      }
    }
  });

  request.open('POST', `${API_URL}&shareType=${shareType}`);
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

    let blocks = editor.cursors.map((cursor) => {
      let range = cursor.getCurrentParagraphBufferRange();
      return editor.getTextInRange(range);
    })

    shareCode(blocks.join(SCOPE_DELIMITER), getExtention(getFile().path), SHARE_TYPES.BLOCK);
  },

  shareSelection: function() {
    let editor = atom.workspace.getActivePaneItem();
    let selections = editor.selections;

    // Get all selections with anything in them
    let texts = selections.map((selection) => {
      return selection.getText()
    }).filter((t) => { return t.length });

    if(texts.length > 0) {
      shareCode(texts.join(SCOPE_DELIMITER), getExtention(getFile().path), SHARE_TYPES.SELECTION);
    } else {
      atom.notifications.addError(MSG_ERROR);
    }
  },

  shareFile: function() {
    let file = getFile();
    let path = file.path;
    let code = file.cachedContents;

    shareCode(code, getExtention(path), SHARE_TYPES.FILE);
  },

  shareLine: function() {
    let editor = atom.workspace.getActivePaneItem();
    let file = getFile();
    let path = file.path;

    let rows = editor.cursors.map((cursor) => {
      let row = cursor.getBufferPosition().row;
      return editor.buffer.lines[row];
    });

    shareCode(rows.join(SCOPE_DELIMITER), getExtention(path), SHARE_TYPES.LINE);
  }
}
