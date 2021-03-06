// @flow
import {connect} from 'react-redux'

import Gridualizer from '../../../components/map/gridualizer'

import * as select from '../selectors'

function mapStateToProps (state, ownProps) {
  const grid = select.activeOpportunityDatasetGrid(state, ownProps)
  // pass in an empty grid if no grid is loaded, so this component can be added
  // to the map without needing to synchronize with the grid loading, and then
  // just be updated when the grid loads
  if (grid) {
    return {
      colorizer: select.activeOpportunityDatasetColorizer(state, ownProps),
      grid
    }
  } else {
    return {
      colorizer: () => '',
      grid: {
        zoom: 0,
        width: 0,
        height: 0,
        north: 0,
        west: 0,
        data: []
      }
    }
  }
}

/**
 * Container for drawing opportunity data on the map.
 */
export default connect(mapStateToProps, {})(Gridualizer)
