import lonlng from 'lonlng'
import {createAction} from 'redux-actions'

import {getIsochronesAndAccessibility} from '../../utils/browsochrones'

export const clearIsochroneResults = createAction('clear isochrone results')
export const setIsochroneCutoff = createAction('set isochrone cutoff')
export const setIsochroneFetchStatus = createAction('set isochrone fetch status')
export const setIsochroneLatLng = createAction('set isochrone latlng', (x) => lonlng(x))
export const setIsochroneResults = createAction('set isochrone results')
export const setCurrentIndicator = createAction('set current indicator')
export const enterAnalysisMode = createAction('enter analysis mode')
export const exitAnalysisMode = createAction('exit analysis mode')
export const setActiveVariant = createAction('set active variant')

export const fetchIsochrone = ({
  bundleId,
  projectId,
  indicator,
  isochroneCutoff,
  modifications,
  origin,
  scenarioId,
  workerVersion,
  next
}) => {
  return [
    setIsochroneFetchStatus(true),
    setIsochroneLatLng(origin),
    getIsochronesAndAccessibility({ scenarioId, projectId, bundleId, modifications, isochroneCutoff, origin, indicator, workerVersion })
      .then(({ isochrone, grid, accessibility, indicator, isochroneCutoff, spectrogramData }) => [
        setIsochroneResults({ isochrone, grid, accessibility, indicator, isochroneCutoff, spectrogramData }),
        setIsochroneFetchStatus(false),
        // TODO there's got to be a more elegant way to call an action after isochrone results are updated
        next
      ])
  ]
}