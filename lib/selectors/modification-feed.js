// @flow
import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'

const selectActiveFeedId = createSelector(
  selectActiveModification,
  (modification = {}) => modification.feed
)

export default createSelector(
  (state) => state.project.feeds,
  selectActiveFeedId,
  (feeds = [], feedId) => feeds.find((feed) => feed.id === feedId)
)
