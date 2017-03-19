# Amnesia-io

[https://amnesia.io](Amnesia.io) integration for [atom](https://atom.io/).

This atom text editor package allows you to share code via amnesia.io directly
from atom, and writes a share link to your clipboard ready for you to pass on.

Amnesia.io is an ephemeral code sharing service with nice collaboration and privacy
features. Read more about it at https://amnesia.io.

## Usage

### Installation

1, In Atom, open Preferences (`ctrl-,`)
2, Go to Install section
3, Search for amnesia-io package. Once it found, click Install button to install package.

#### Manual installation

```bash
  git clone https://github.com/nathamanath/amnesia-atom ~/.atom/packages/amnesia-atom
  cd ~/.atom/packages/amnesia-atom
  npm install
```

### Functionality

The amnesia-io package adds the following behaviour to atom:

* `amnesia-io:shareFile` - Share the content of the current file.
* `amnesia-io:shareSelection` - Share the highlighted selection.
* `amnesia-io:shareBlock` - Share the current code block.

For each you get an atom notification of success or error. On successfully uploading
code to amnesia.io, your unique share link is written to your clipboard.

### Configuration

#### Settings

You can customise your usage of amnesia.io via the amnesia-io config page, or via
your `~/.atom/config.cson`.

See example below, values shown are defaults:

```cson
  "*":
    ...

    "amnesia-io":

      # How long amnesia.io will hold on to your code snippets for
      ttl: 6000,           

      # Syntax highlighting format which will be used if it cannot be discerned
      # from your file name
      defaultFormat: "txt"

    ...
```

#### Keymaps

Default key mappings are as follows:

|                | Windows          | Linux            | OSX             |
|----------------|------------------|------------------|-----------------|
| shareFile      | ctrl-alt-shift-f | ctrl-alt-shift-f | cmd-alt-shift-f |
| shareSelection | ctrl-alt-shift-s | ctrl-alt-shift-s | cmd-alt-shift-s |
| shareBlock     | ctrl-alt-shift-b | ctrl-alt-shift-b | cmd-alt-shift-b |

Keymaps can be overridden in `~/.atom/keymap.cson` like so:

```cson

  ...

  '.platform-darwin atom-workspace':
    'amnesia-io:FUNCTION': 'KEY_COMBO'

  '.platform-win32 atom-workspace':
    'amnesia-io:FUNCTION': 'KEY_COMBO'

  '.platform-linux atom-workspace':
    'amnesia-io:FUNCTION': 'KEY_COMBO'

  ...

```

Where `FUNCTION` is a value from the first column of the table above, and `KEY_COMBO`
is a key combination string like `ctrl-alt-shift-a` for example.
See [atom docs](http://flight-manual.atom.io/using-atom/sections/basic-customization/#customizing-keybindings)
for more on this.

## Development

The amnesia-io atom package is written in es6

To get going in dev mode do:

```bash
  git clone https://github.com/nathamanath/amnesia-atom
  cd amnesia-atom
  npm install
  apm link --dev
  atom -d .
```

Some useful atom keybindings for package development:

* `ctrl-alt-r` - reload atom window
* `cmd-alt-ctrl-p` - run package tests
