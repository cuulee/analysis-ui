// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import {Button} from '../buttons'
import FrequencyEntry from './frequency-entry'
import {Checkbox} from '../input'
import SelectFeedAndRoutes from './select-feed-and-routes'
import {create as createFrequencyEntry} from '../../utils/frequency-entry'

import type {
  Feed,
  Modification,
  RoutePatterns,
  Stop,
  Timetable
} from '../../types'

type Props = {
  allPhaseFromTimetableStops: any,
  feeds: Feed[],
  fullyQualifiedRouteStops: Stop[],
  modification: Modification,
  routePatterns: RoutePatterns,
  projectTimetables: Timetable[],
  selectedFeed: Feed,

  // actions
  setActiveTrips(any): void,
  update(any): void,
  updateAndRetrieveFeedData: (any) => void
}

/**
 * Convert a route to a frequency-based representation, and adjust the frequency
 *
 * @author mattwigway
 */
export default class ConvertToFrequencyComponent
  extends Component<void, Props, void> {
  onRouteChange = ({
    feed,
    routes
  }: {
    feed: null | string,
    routes: null | string[]
  }) => {
    const {modification, updateAndRetrieveFeedData} = this.props
    updateAndRetrieveFeedData({
      entries: (modification.entries || []).map(entry => ({
        ...entry,
        sourceTrip: null,
        patternTrips: []
      })),
      feed,
      routes
    })
  }

  replaceEntry = (index: number, newEntryProps: any) => {
    const {modification, update} = this.props
    const entries = [...(modification.entries || [])]
    entries[index] = {
      ...entries[index],
      ...newEntryProps
    }
    update({entries})
  }

  removeEntry = (index: number) => {
    const {modification, update} = this.props
    const entries = [...(modification.entries || [])]
    entries.splice(index, 1)
    update({entries})
  }

  newEntry = () => {
    const {modification, update} = this.props
    const entries = [...(modification.entries || [])]
    entries.push(createFrequencyEntry())
    update({entries})
  }

  setRetainTripsOutsideFrequencyEntries = (
    e: Event & {currentTarget: HTMLInputElement}
  ) => {
    this.props.update({
      retainTripsOutsideFrequencyEntries: e.currentTarget.checked
    })
  }

  render () {
    const {
      allPhaseFromTimetableStops,
      feeds,
      fullyQualifiedRouteStops,
      modification,
      routePatterns,
      projectTimetables,
      selectedFeed
    } = this.props
    return (
      <div>
        <SelectFeedAndRoutes
          feeds={feeds}
          onChange={this.onRouteChange}
          selectedFeed={selectedFeed}
          selectedRouteIds={modification.routes}
        />

        <Checkbox
          label='Retain existing scheduled trips at times without new frequencies specified'
          onChange={this.setRetainTripsOutsideFrequencyEntries}
          checked={modification.retainTripsOutsideFrequencyEntries}
        />

        {modification.routes &&
          modification.routes.length > 0 &&
          <p>
            <Button block style='success' onClick={this.newEntry}>
              <Icon type='plus' /> Add frequency entry
            </Button>
          </p>}

        {selectedFeed &&
          modification.routes &&
          modification.routes.length > 0 &&
          (modification.entries || []).map((entry, eidx) => {
            return (
              <FrequencyEntry
                allPhaseFromTimetableStops={allPhaseFromTimetableStops}
                entry={entry}
                feed={selectedFeed}
                index={eidx + 1}
                key={eidx}
                modificationStops={fullyQualifiedRouteStops}
                remove={this.removeEntry.bind(this, eidx)}
                routePatterns={routePatterns}
                routes={modification.routes}
                projectTimetables={projectTimetables}
                setActiveTrips={this.props.setActiveTrips}
                update={this.replaceEntry.bind(this, eidx)}
              />
            )
          })}
      </div>
    )
  }
}
