'use babel'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.
import assert from 'assert'
import fs from 'fs'
import Path from 'path'

// FIXME: FakeXMLHttpRequest is not working properly in atom 1.16.0-beta0
import FakeXMLHttpRequest from "fake-xml-http-request"

import {Range, Point} from'atom'

import AmnesiaIo from '../lib/amnesia-io'

let readFile = (path) => {
  return fs.readFileSync(Path.join(__dirname, "./fixtures/", path), "utf8")
}

let getEditor = () => {
  return atom.workspace.getActiveTextEditor()
}

let atomCommand = (editor, cmd) => {
  atom.commands.dispatch(atom.views.getView(editor), cmd)
}

let makeAssertions = function(requests, payload) {
  assert(!!requests[0])
  assert.equal(requests[0].method, 'POST')
  assert.equal(requests[0].requestHeaders['Content-Type'], 'application/json')
  assert.deepEqual(JSON.parse(requests[0].requestBody), payload)
}

describe('AmnesiaIo', function() {
  let requests

  beforeEach(function() {

    atom.packages.activatePackage('amnesia-io')
    editor = atom.workspace.getActiveTextEditor()

    requests = []

    global.XMLHttpRequest = function() {
      let r =  new FakeXMLHttpRequest(arguments)
      requests.push(r)
      return r
    }

  })

  describe('amnesia-io:share-file', function() {

    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('code.js')
      })
    })

    it('shares file content', function() {
      let payload = {
        content: readFile('code.js'),
        extension: 'js',
        ttl: 43200
      }

      let editor = getEditor()
      editor.setCursorBufferPosition([1, 1])

      atomCommand(editor, 'amnesia-io:share-file')
      makeAssertions(requests, payload)
    })
  })

  describe('amnesia-io:share-selection', function() {

    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('code.js')
      })
    })

    it('shares selected content', function() {
      let payload = {
        content: 'let test = true',
        extension: 'js',
        ttl: 43200
      }

      let editor = getEditor()
      let range = new Range(new Point(2, 0), new Point(2, 15))
      editor.setSelectedBufferRange(range)

      atomCommand(editor, 'amnesia-io:share-selected')
      makeAssertions(requests, payload)
    })
  })

  describe('amnesia-io:shareBlock', function() {

    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('code.js')
      })
    })

    it('shares selected content', function() {
      let payload = {
        content: 'let test = true\nlet thing = false\nlet somethingElse = 12',
        extension: 'js',
        ttl: 43200
      }

      let editor = getEditor()
      editor.setCursorBufferPosition([3, 1])

      atomCommand(editor, 'amnesia-io:share-block')
      makeAssertions(requests, payload)
    })
  })

  describe('amnesia-io:share-line', function() {
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('code.js')
      })
    })

    it('shares the current line', function() {
      let payload = {
        content: 'let thing = false',
        extension: 'js',
        ttl: 43200
      }

      let editor = getEditor()
      editor.setCursorBufferPosition([3, 5])

      atomCommand(editor, 'amnesia-io:share-line')
      makeAssertions(requests, payload)
    })
  })

  describe('highlighting format', function() {

    describe('with extension', function() {

      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('code.js')
        })
      })

      it('gets format from file extension', function() {
        atomCommand(getEditor(), 'amnesia-io:share-file')
        assert.equal(JSON.parse(requests[0].requestBody).extension, 'js')
      })
    })


    describe('no extension', function() {

      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('no_extension')
        })
      })

      it('uses default format if no extension', function() {
        atomCommand(getEditor(), 'amnesia-io:share-file')
        assert.equal(JSON.parse(requests[0].requestBody).extension, 'bash')
      })

    })

  })
})
