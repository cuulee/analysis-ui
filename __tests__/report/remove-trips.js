/* global describe, it, expect */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import { mockFeed, mockModification } from '../../test-utils/mock-data'
import Leaflet from '../../test-utils/mock-leaflet'

import RemoveTrips from '../../lib/report/remove-trips'

describe('Report > RemoveTrips', () => {
  it('renders correctly', () => {
    const props = {
      feedsById: { '1': mockFeed },
      modification: mockModification
    }

    // mount component
    const tree = mount(
      <RemoveTrips
        {...props}
        />
      , {
        attachTo: document.getElementById('test')
      }
    )
    expect(mountToJson(tree.find('ul'))).toMatchSnapshot()
    expect(Leaflet.geoJson.mock.calls[0][0]).toMatchSnapshot()
  })
})
