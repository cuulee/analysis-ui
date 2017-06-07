// @flow
/** Select modes of travel */

import React from 'react'
import DeepEqualComponent from '../deep-equal'
import Icon from '../icon'
import messages from '../../utils/messages'

import type {ProfileRequest} from '../../types'

type Props = {
  profileRequest: ProfileRequest,
  setProfileRequest(ProfileRequest): void
}

const WALK = 'WALK'
const BICYCLE = 'BICYCLE'
const CAR = 'CAR'

export default class ModeSelector extends DeepEqualComponent<void, Props, void> {
  render (): Element {
    const {profileRequest} = this.props

    const transit = profileRequest.transitModes !== ''
    const nonTransitMode = transit ? profileRequest.accessModes : profileRequest.directModes

    return <div className='btn-group' role='group' aria-label={messages.analysis.mode}>
      <label htmlFor='mode-walk' className={`btn btn-default ${nonTransitMode === WALK ? 'active' : ''}`}>
        <input
          type='radio'
          id='mode-walk'
          className='sr-only'
          name='streetMode'
          value={WALK}
          checked={nonTransitMode === WALK}
          onChange={this.selectNonTransitMode}
          aria-label={messages.analysis.modes.walk} />
        <Icon type='male' /> {/* TODO we need a better icon */}
      </label>
      <label htmlFor='mode-bike' className={`btn btn-default ${nonTransitMode === BICYCLE ? 'active' : ''}`}>
        <input
          type='radio'
          className='sr-only'
          name='streetMode'
          id='mode-bike'
          value={BICYCLE}
          checked={nonTransitMode === BICYCLE}
          onChange={this.selectNonTransitMode}
          aria-label={messages.analysis.modes.bicycle} />
        <Icon type='bicycle' />
      </label>
      <label htmlFor='mode-car' className={`btn btn-default ${nonTransitMode === CAR ? 'active' : ''}`}>
        <input
          type='radio'
          className='sr-only'
          name='streetMode'
          value={CAR}
          id='mode-car'
          checked={nonTransitMode === CAR}
          onChange={this.selectNonTransitMode}
          aria-label={messages.analysis.modes.car} />
        <Icon type='car' />
      </label>

      <label htmlFor='mode-transit' className={`btn btn-default ${transit ? 'active' : ''}`}>
        <input
          type='checkbox'
          className='sr-only'
          name='streetMode'
          value='transit'
          id='mode-transit'
          checked={transit}
          onChange={this.toggleTransit}
          aria-label={messages.analysis.modes.transit} />
        <Icon type='bus' />
      </label>
    </div>
  }

  selectNonTransitMode = (e: Event): void => {
    if (!e.target.checked) return

    const {profileRequest, setProfileRequest} = this.props
    // easiest to just overwrite both. Access mode is used in transit searches and direct mode in
    // non-transit searches; overwriting only one of them however would require additional updates
    // when toggling transit.
    setProfileRequest({
      ...profileRequest,
      accessModes: e.target.value,
      directModes: e.target.value
    })
  }

  toggleTransit = (e: Event): void => {
    const {profileRequest, setProfileRequest} = this.props
    setProfileRequest({
      ...profileRequest,
      transitModes: e.target.checked ? 'TRANSIT' : ''
    })
  }
}