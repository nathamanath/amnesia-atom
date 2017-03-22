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
let menuItem = null;

const disposeMenuItem = (menuItem) => {
  if(menuItem) {
    menuItem.dispose();
    menuItem = null;
  }
}

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
    subscriptions.add(atom.commands.add('.tree-view [is=tree-view-file]', 'amnesia-io:tree-share-file', Amnesia.shareTreeFile));

    // If configured, add amnesia.io share option to tree view context menu
    atom.config.observe('amnesia-io.treeViewShare', (value) => {
      if(value) {
        menuItem = atom.contextMenu.add({
          '.tree-view [is=tree-view-file]': [{
            label: 'Share on amnesia.io',
            command: 'amnesia-io:tree-share-file'
          }]
        })
      } else {
        disposeMenuItem(menuItem);
      }
    });
  },

  deactivate: () => {
    disposeMenuItem(menuItem);
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
    },
    treeViewShare: {
      title: 'Share from tree-view',
      description: 'When I right click on a file in tree view, show a share that file on amnesia button',
      type: 'boolean',
      default: true
    }
  }
}
