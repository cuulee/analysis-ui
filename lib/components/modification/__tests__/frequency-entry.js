// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import {
  mockFeed,
  mockPattern,
  mockTimetable
} from '../../../utils/mock-data'
import FrequencyEntry from '../frequency-entry'

describe('Component > FrequencyEntry', () => {
  it('renders correctly', () => {
    const replaceTimetableFn = jest.fn()
    const removeTimetableFn = jest.fn()
    const setActiveTripsFn = jest.fn()
    const tree = renderer
      .create(
        <FrequencyEntry
          allPhaseFromTimetableStops={{}}
          entry={mockTimetable}
          feed={mockFeed}
          modificationStops={[]}
          update={replaceTimetableFn}
          remove={removeTimetableFn}
          projectTimetables={[]}
          setActiveTrips={setActiveTripsFn}
          routes={['route1']}
          routePatterns={[mockPattern]}
          trip='abcd'
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(replaceTimetableFn).not.toBeCalled()
    expect(removeTimetableFn).not.toBeCalled()
    expect(setActiveTripsFn).not.toBeCalled()
  })
})
