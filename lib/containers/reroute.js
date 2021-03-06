// @flow
import {connect} from 'react-redux'

import Reroute from '../components/modification/reroute'
import * as select from '../selectors'

function mapStateToProps (
  state: any,
  ownProps
): any {
  return {
    feeds: select.feedsWithBundleNames(state, ownProps),
    mapState: state.mapState,
    qualifiedStops: select.qualifiedStopsFromSegments(state, ownProps),
    routePatterns: select.routePatterns(state, ownProps),
    segmentDistances: select.segmentDistances(state, ownProps),
    selectedFeed: select.modificationFeed(state, ownProps),
    stops: select.stopsFromModification(state, ownProps)
  }
}

export default connect(mapStateToProps)(Reroute)
