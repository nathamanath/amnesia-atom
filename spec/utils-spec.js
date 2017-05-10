'use babel';

import assert from 'assert'
import * as Utils from '../lib/utils'

describe('Utils', function() {
  describe('.formattedSeconds', function() {

    it('formats seconds as HH:MM::SS', function() {
      assert.equal(Utils.formattedSeconds(1), "00:00:01")
      assert.equal(Utils.formattedSeconds(60), "00:01:00")
      assert.equal(Utils.formattedSeconds(60*60), "01:00:00")
      assert.equal(Utils.formattedSeconds(60*60*24), "24:00:00")
      assert.equal(Utils.formattedSeconds(60*60*24 + 66), "24:01:06")
    })

  })

  describe('.normalizeSpacing', function() {

    it('removes excess spacing at start of lines', function() {
      let spacious = "  bla\n    blabla\n    blabla\n  bla"
      let fixed = "bla\n  blabla\n  blabla\nbla"

      assert.equal(Utils.normalizeSpacing(spacious), fixed)
    })

    it('isnt fooled by blank lines', function() {
      let spacious = "  bla\n\n    blabla\n    blabla\n  bla"
      let fixed = "bla\n\n  blabla\n  blabla\nbla"

      assert.equal(Utils.normalizeSpacing(spacious), fixed)

      // or blank lines with trailing spaces
      let spacious1 = "  bla\n \n    blabla\n    blabla\n  bla"
      let fixed1 = "bla\n \n  blabla\n  blabla\nbla"

      assert.equal(Utils.normalizeSpacing(spacious1), fixed1)
    })

    it('handles osx, unix, and windows line endings', function() {
      let win = "  bla\r\n \r\n    blabla\r\n    blabla\r\n  bla"
      let osx = "  bla\r \r    blabla\r    blabla\r  bla"
      let unix = "  bla\n \n    blabla\n    blabla\n  bla"

      let fixed = "bla\n \n  blabla\n  blabla\nbla"

      assert.equal(Utils.normalizeSpacing(win), fixed)
      assert.equal(Utils.normalizeSpacing(osx), fixed)
      assert.equal(Utils.normalizeSpacing(unix), fixed)
    })

    it('dosent change spacing when it shouldnt', function() {
      let fixed = "bla\n  blabla\n  blabla\nbla"

      assert.equal(Utils.normalizeSpacing(fixed), fixed)
    })

  })
})
