'use babel';

/**
 * Amnesia.io intergration for atom
 */

import {CompositeDisposable} from 'atom'
import Amnesia from './amnesia';

import fs from 'fs'
import Path from 'path'

// Track subscriptions so that package can be deactivated
let subscriptions = null;

export default {

  activate: () => {
    // Events subscribed to in atom's system can be easily cleaned up with a
    // CompositeDisposable
    subscriptions = new CompositeDisposable();

    // Register commands
    subscriptions.add(atom.commands.add('atom-text-editor', 'amnesia-io:share-file', Amnesia.shareFile));
    subscriptions.add(atom.commands.add('atom-text-editor', 'amnesia-io:share-selected', Amnesia.shareSelection));
    subscriptions.add(atom.commands.add('atom-text-editor', 'amnesia-io:share-block', Amnesia.shareBlock));
    subscriptions.add(atom.commands.add('atom-text-editor', 'amnesia-io:share-line', Amnesia.shareLine));
  },

  deactivate: () => {
    subscriptions.dispose();
  },

  config: {
    ttl: {
      title: 'TTL',
      description: 'Time in seconds that your shared code will be available for. If set to `0` your shared code will not be forgotten.',
      type: 'integer',
      default: 60*60*12, // 12 hrs
      minimum: 0
    },
    defaultFormat: {
      title: 'Default file format',
      description: 'Formatting to use if format cannot be descerned from file',
      type: 'string',
      default: 'bash'
    }
  }
}
