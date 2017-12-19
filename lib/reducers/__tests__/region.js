// @flow

import {handleActions} from 'redux-actions'

import * as region from '../region'

import {mockRegion, mockRegionalAnalyses} from '../../utils/mock-data'

describe('reducers > region', () => {
  const reducer = handleActions(region.reducers, region.initialState)

  // Default State Test
  it('should handle default state', () => {
    expect(reducer(undefined, {type: 'blah', payload: {}})).toMatchSnapshot()
  })

  // Specific Handler Tests
  it('should handle delete region', () => {
    const action = {type: 'delete region', payload: mockRegion._id}
    const beginState = {regions: [mockRegion]}
    expect(reducer(beginState, action)).toMatchSnapshot()
  })

  it('should handle set all regions', () => {
    const action = {type: 'set all regions', payload: [mockRegion]}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set region', () => {
    const action = {type: 'set region', payload: mockRegion}
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle delete regional analysis', () => {
    const action = {
      type: 'delete regional analysis',
      payload: 'abcd'
    }
    expect(
      reducer({regionalAnalyses: mockRegionalAnalyses}, action)
    ).toMatchSnapshot()
  })
})
