// @flow
import {connect} from 'react-redux'
import {
  ISOCHRONE_COMPONENT,
  OPPORTUNITY_COMPONENT,
  EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT
} from '../constants/map'
import {push} from 'react-router-redux'
import SinglePointAnalysis from '../components/analysis'
import {
  fetchTravelTimeSurface,
  clearComparisonProject,
  setComparisonProject,
  enterAnalysisMode,
  exitAnalysisMode,
  setActiveVariant,
  setProfileRequest
} from '../actions/analysis'
import {
  load as loadAllRegionalAnalyses,
  createRegionalAnalysis
} from '../actions/analysis/regional'
import {addComponent, removeComponent} from '../actions/map'
import * as select from '../selectors'
import downloadJson from '../utils/download-json'
import get from '../utils/get'

function mapStateToProps (state, ownProps) {
  const {analysis, mapState, project} = state
  const projectId = get(state, 'project.currentProject._id')
  const variantIndex = get(state, 'analysis.profileRequest.variantIndex', 0)
  const currentBundle = select.currentBundle(state, ownProps)
  const currentRegion = select.currentRegion(state, ownProps) || {}
  return {
    // TODO duplicate code below and in containers/isochrone
    bundleId: currentBundle ? currentBundle._id : null,
    comparisonBundleId: analysis.comparisonBundleId,
    comparisonProjectId: analysis.comparisonProjectId,
    comparisonVariant: analysis.comparisonVariant,
    isFetchingIsochrone: !!analysis.isFetchingIsochrone,
    isochroneFetchStatusMessage: analysis.isochroneFetchStatusMessage,
    isShowingComparisonIsochrone: !!select.comparisonIsochrone(state),
    isShowingIsochrone: !!select.isochrone(state),
    isShowingOpportunities: mapState.components.indexOf(
      OPPORTUNITY_COMPONENT
    ) !== -1,
    modifications: select.modifications(state, ownProps).filter(m => m.variants[variantIndex]),
    profileRequest: analysis.profileRequest,
    regionId: currentRegion._id,
    regionalAnalyses: select.regionalAnalyses(state, ownProps),
    regionalAnalysisBounds: analysis.profileRequest.bounds,
    regionBounds: currentRegion.bounds,
    projectApplicationErrors: analysis.projectApplicationErrors,
    projectApplicationWarnings: analysis.projectApplicationWarnings,
    projectId,
    projectName: project.currentProject.name,
    projects: project.projects,
    variantIndex,
    variantName: project.currentProject.variants[variantIndex],
    variants: project.currentProject.variants
  }
}

const addEditRegionalAnalysisBoundsLayerToMap = () =>
  addComponent(EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT)
const addIsochroneLayerToMap = () => addComponent(ISOCHRONE_COMPONENT)
const addOpportunityLayerToMap = () => addComponent(OPPORTUNITY_COMPONENT)
const removeEditRegionalAnalysisBoundsLayerFromMap = () =>
  removeComponent(EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT)
const removeIsochroneLayerFromMap = () => removeComponent(ISOCHRONE_COMPONENT)
const removeOpportunityLayerFromMap = () =>
  removeComponent(OPPORTUNITY_COMPONENT)

const downloadIsochrone = () => (dispatch, getState) => {
  const state = getState()
  const isochrone = select.isochrone(state)
  const {analysis, project} = state
  const cutoff = select.maxTripDurationMinutes(state)
  const name = project.currentProject.name
  const variantName = project.currentProject.variants[analysis.activeVariant]
  downloadJson({
    data: {
      ...isochrone,
      properties: null // TODO set this in jsolines
    },
    filename: `analysis-isochrone-${name}-${variantName}-${cutoff}-minutes.json`
  })
}

const downloadComparisonIsochrone = () => (dispatch, getState) => {
  const state = getState()
  const comparisonIsochrone = select.comparisonIsochrone(state)
  const {analysis} = state
  const cutoff = select.maxTripDurationMinutes(state)
  const comparisonProject = select.comparisonProject(state)
  const variantName = comparisonProject.variants[analysis.comparisonVariant] || 'baseline'
  downloadJson({
    data: {
      ...comparisonIsochrone,
      properties: null // TODO set this in jsolines
    },
    filename: `analysis-isochrone-${comparisonProject.name}-${variantName}-${cutoff}-minutes.json`
  })
}

const mapDispatchToProps = {
  addEditRegionalAnalysisBoundsLayerToMap,
  addIsochroneLayerToMap,
  addOpportunityLayerToMap,
  clearComparisonProject,
  createRegionalAnalysis,
  downloadComparisonIsochrone,
  downloadIsochrone,
  enterAnalysisMode,
  exitAnalysisMode,
  fetchTravelTimeSurface,
  loadAllRegionalAnalyses,
  push,
  removeEditRegionalAnalysisBoundsLayerFromMap,
  removeIsochroneLayerFromMap,
  removeOpportunityLayerFromMap,
  setActiveVariant,
  setComparisonProject,
  setProfileRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(SinglePointAnalysis)
