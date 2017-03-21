'use babel';

import assert from 'assert'
import * as Utils from '../lib/utils'

describe('Utils', function() {
  describe('#formattedSeconds', function() {

    it('formats seconds as words', function() {
      assert(Utils.formattedSeconds(1), "1 second")
      assert(Utils.formattedSeconds(60), "1 minute")
      assert(Utils.formattedSeconds(60*60), "1 hour")
      assert(Utils.formattedSeconds(60*60*24), "1 day")
      assert(Utils.formattedSeconds(60*60*24), "1 day")
      assert(Utils.formattedSeconds(60*60*24*12), "12 days")
    })

  })
})
