'use babel';

import assert from 'assert'
import * as Utils from '../lib/utils'

describe('Utils', function() {
  describe('.formattedSeconds', function() {

    it('formats seconds as words', function() {
      assert.equal(Utils.formattedSeconds(1), "00:00:01")
      assert.equal(Utils.formattedSeconds(60), "00:01:00")
      assert.equal(Utils.formattedSeconds(60*60), "01:00:00")
      assert.equal(Utils.formattedSeconds(60*60*24), "24:00:00")
      assert.equal(Utils.formattedSeconds(60*60*24 + 66), "24:01:06")
    })

  })
})
