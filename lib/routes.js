// @flow
/**
 * React Router container to be rendered by woonerf/mount.
 * @author mattwigway
 */

import React from 'react'
import ReactGA from 'react-ga'
import {IndexRoute, Route, Router} from 'react-router'

import Application from './containers/application'
import {authIsRequired, bootstrap, lock, logout} from './utils/auth0'
import Bundles from './components/bundles'
import CreateBundle from './containers/create-bundle'
import EditBundle from './containers/edit-bundle'
import EditRegion from './containers/edit-region'
import EditProject from './containers/edit-project'
import NotFound from './components/404.js'
import ImportModifications from './containers/import-modifications'
import ImportShapefile from './containers/import-shapefile'
import ModificationEditor from './containers/modification-editor'
import Modifications from './containers/modifications'
import Region from './containers/region'
import Project from './containers/project'
import SelectRegion from './containers/select-region'
import SelectProject from './containers/select-project'
import SinglePointAnalysis from './containers/single-point-analysis'
import OpportunityDatasets from './modules/opportunity-datasets'
import Report from './containers/report'
import RegionalResultsList from './containers/regional-results-list'
import Regional from './containers/regional-analysis-results'

let logPageView = function () {}
if (process.env.NODE_ENV !== 'test') {
  // Initialize Google Analytics
  ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID || 'UA-000000-01', {
    debug: process.env.NODE_ENV !== 'production'
  })

  // Longhand function style to pick up `this` from Router
  logPageView = function () {
    ReactGA.pageview(this.state.location.pathname)
  }
}

// initialize the application
export default function Routes ({
  history,
  store
}: {
  history: History,
  store: Store
}) {
  // allow the store to be accessible from the command line
  if (window) window.store = store

  // Auth0 requires access to the store
  authIsRequired && bootstrap(store)

  // Mount the routes
  return (
    <Router
      history={history}
      onUpdate={logPageView}>
      <Route
        path='/reports/:regionId/projects/:projectId/variants/:variantId'
        component={Report}
      />
      <Route path='/login' onEnter={() => lock.show()} />
      <Route path='/logout' onEnter={logout} />
      <Route path='/' component={Application}>
        <IndexRoute component={SelectRegion} />
        <Route path='regions/create' component={EditRegion} />
        <Route path='regions/:regionId' component={Region}>
          <IndexRoute component={SelectProject} />
          <Route path='bundles' component={Bundles}>
            <IndexRoute component={EditBundle} />
            <Route path='create' component={CreateBundle} />
            <Route path=':bundleId' component={EditBundle} />
          </Route>
          <Route path='opportunities' component={OpportunityDatasets.components.Heading}>
            <IndexRoute component={OpportunityDatasets.components.List} />
            <Route path='upload' component={OpportunityDatasets.components.Upload} />
          </Route>
          <Route path='edit' component={EditRegion} />
          <Route path='projects' component={SelectProject} />
          <Route path='projects/create' component={EditProject} />
        </Route>
        <Route path='projects/:projectId' component={Project}>
          <IndexRoute component={Modifications} />
          <Route path='edit' component={EditProject} />
          <Route path='import-modifications' component={ImportModifications} />
          <Route path='import-shapefile' component={ImportShapefile} />
          <Route
            path='modifications/:modificationId'
            component={ModificationEditor}
          />
          <Route path='analysis' component={SinglePointAnalysis} />
          <Route path='analysis/:variantId' component={SinglePointAnalysis} />
          <Route path='regional' component={RegionalResultsList} />
          <Route path='regional/:regionalAnalysisId' component={Regional} />
          <Route
            path='analysis/regional/:regionalAnalysisId'
            component={Regional}
          />
        </Route>
        <Route path='*' component={NotFound} />
      </Route>
      <Route path='*' component={NotFound} />
    </Router>
  )
}
