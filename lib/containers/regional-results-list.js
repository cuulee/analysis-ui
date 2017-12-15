import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import RegionalResultsList from '../components/analysis/regional-results-list'
import selectCurrentProject from '../selectors/current-project'
import selectCurrentProjectId from '../selectors/current-project-id'
import selectRegionalAnalyses from '../selectors/regional-analyses'

import {
  deleteRegionalAnalysis,
  load,
  setActiveRegionalAnalyses
} from '../actions/analysis/regional'

function mapStateToProps (state, ownProps) {
  return {
    allAnalyses: selectRegionalAnalyses(state, ownProps)
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    loadAllAnalyses: () =>
      dispatch((dispatch, getState) => {
        const currentProject = selectCurrentProject(getState(), ownProps)
        dispatch(load(currentProject.regionId))
      }),
    deleteAnalysis: analysisId => dispatch(deleteRegionalAnalysis(analysisId)),
    goToAnalysis: analysisId =>
      dispatch((dispatch, getState) => {
        const projectId = selectCurrentProjectId(getState(), ownProps)
        dispatch([
          setActiveRegionalAnalyses({_id: analysisId}),
          push(`/projects/${projectId}/regional/${analysisId}`)
        ])
      }),
    goToSinglePointAnalysisPage: () =>
      dispatch((dispatch, getState) => {
        const projectId = selectCurrentProjectId(getState(), ownProps)
        dispatch(push(`/projects/${projectId}/analysis`))
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalResultsList)
