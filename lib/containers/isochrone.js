// @flow
import {connect} from 'react-redux'

import {
  fetchTravelTimeSurface,
  setDestination,
  setIsochroneLonLat
} from '../actions/analysis'
import {addComponent, removeComponent} from '../actions/map'
import Isochrone from '../components/map/isochrone'
import {
  DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT,
  ISOCHRONE_COMPONENT
} from '../constants/map'
import selectIsochrone from '../selectors/isochrone'
import selectComparisonIsochrone from '../selectors/comparison-isochrone'
import selectComparisonInProgress from '../selectors/comparison-in-progress'

function mapStateToProps (state, props) {
  const {analysis, mapState} = state
  return {
    comparisonIsochrone: selectComparisonIsochrone(state),
    comparisonInProgress: selectComparisonInProgress(state),
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    isochrone: selectIsochrone(state),
    isochroneCutoff: analysis.isochroneCutoff,
    isochroneLonLat: analysis.isochroneLonLat || state.mapState.center,
    variantIndex: analysis.activeVariant,

    isDestinationTravelTimeDistributionComponentOnMap: mapState.components.includes(
      DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT
    )
  }
}

function mapDispatchToProps (dispatch: Dispatch, props) {
  return {
    fetchTravelTimeSurface: opts => dispatch(fetchTravelTimeSurface(opts)),
    setIsochroneLonLat: lonlat => dispatch(setIsochroneLonLat(lonlat)),
    remove: () => dispatch(removeComponent(ISOCHRONE_COMPONENT)),
    addDestinationTravelTimeDistributionComponentToMap: () =>
      dispatch(addComponent(DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT)),
    removeDestinationTravelTimeDistributionComponentFromMap: () =>
      dispatch(removeComponent(DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT)),
    setDestination: destination => dispatch(setDestination(destination))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Isochrone)
