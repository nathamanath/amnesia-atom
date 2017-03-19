'use babel';

/**
 * Amnesia.io intergration for atom
 */

import {CompositeDisposable} from 'atom'

import Amnesia from './amnesia';

export default {
  subscriptions: null,
  amnesia: null,

  activate: (_state) => {
    // Events subscribed to in atom's system can be easily cleaned up with a
    // CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register commands
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'amnesia-io:share-file', Amnesia.shareFile));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'amnesia-io:share-selected', Amnesia.shareSelection));
    this.subscriptions.add(atom.commands.add('atom-text-editor', 'amnesia-io:share-block', Amnesia.shareBlock));
  },

  deactivate: () => {
    this.subscriptions.dispose();
  },

  config: {
    ttl: {
      title: 'TTL',
      description: 'How long your shared code is available for',
      type: 'integer',
      default: 60000,
      minimum: 1000
    },
    defaultFormat: {
      title: 'Default file format',
      description: 'Formatting to use if format cannot be descerned from file',
      type: 'string',
      default: 'bash'
    }
  }
}
