// @flow
import Icon from '@conveyal/woonerf/components/icon'
import Pure from '@conveyal/woonerf/components/pure'
import classnames from 'classnames'
import pathToRegex from 'path-to-regexp'
import React from 'react'
import {Link} from 'react-router'
import {sprintf} from 'sprintf-js'

import {CREATING_ID} from '../constants/region'
import messages from '../utils/messages'
import Tip from './tip'

type Props = {
  currentPath: string,
  outstandingRequests: number,
  regionId?: string,
  projectId?: string,
  username?: string
}

type State = {
  error: null | string,
  online: boolean
}

const paths = {
  home: pathToRegex('/'),
  regions: pathToRegex('/regions'),
  bundles: pathToRegex('/regions/:regionId/bundles'),
  bundleActions: pathToRegex('/regions/:regionId/bundles/:action'),
  editRegion: pathToRegex('/regions/:regionId/edit'),
  createOpportunityDataset: pathToRegex('/regions/:regionId/opportunities/:opportunitiesKey'),
  showOpportunityDatasets: pathToRegex('/regions/:regionId/opportunities'),
  projects: pathToRegex('/regions/:regionId'),
  createProject: pathToRegex('/regions/:regionId/projects/create'),
  editProjectSettings: pathToRegex('/projects/:projectId/edit'),
  editProject: pathToRegex('/projects/:projectId'),
  editModification: pathToRegex('/projects/:sid/modifications/:mid'),
  importModifications: pathToRegex(
    '/projects/:projectId/import-modifications'
  ),
  importShapefile: pathToRegex('/projects/:projectId/import-shapefile'),
  analyzeProject: pathToRegex('/projects/:projectId/analysis'),
  analyzeProjectVariant: pathToRegex(
    '/projects/:projectId/analysis/:variant'
  ),
  allRegionalAnalysis: pathToRegex('/projects/:projectId/regional'),
  regionalAnalysis: pathToRegex('/projects/:projectId/regional/:regionalId')
}

const isBundlePath = p => paths.bundles.exec(p) || paths.bundleActions.exec(p)

const isRegionPath = p =>
  paths.home.exec(p) ||
  paths.regions.exec(p) ||
  paths.projects.exec(p) ||
  paths.createProject.exec(p)

const isEditProjectPath = p =>
  paths.editProject.exec(p) ||
  paths.editProjectSettings.exec(p) ||
  paths.editModification.exec(p) ||
  paths.importModifications.exec(p) ||
  paths.importShapefile.exec(p)

const isRegionalPath = p =>
  paths.allRegionalAnalysis.exec(p) || paths.regionalAnalysis.exec(p)

const isAnalysisPath = p =>
  paths.analyzeProject.exec(p) || paths.analyzeProjectVariant.exec(p)

const isOpportunitiesPath = p =>
  paths.createOpportunityDataset.exec(p) || paths.showOpportunityDatasets.exec(p)

export default class Sidebar extends Pure {
  props: Props
  state: State

  state = {
    error: null,
    online: navigator.onLine
  }

  componentDidMount () {
    // TODO: Check to see if it can communicate with the backend, not just the internet (for local development)
    window.addEventListener('online', () => this.setState({online: true}))
    window.addEventListener('offline', () => this.setState({online: false}))
    window.addEventListener('beforeunload', e => {
      if (this.props.outstandingRequests > 0) {
        const returnValue = (e.returnValue = messages.nav.unfinishedRequests)
        return returnValue
      }
    })
    window.addEventListener('error', error =>
      this.setState({error: error.message})
    )
    window.addEventListener('unhandledrejection', error =>
      this.setState({error: error.reason.stack})
    )
  }

  render () {
    const {
      currentPath,
      outstandingRequests,
      regionId,
      projectId,
      username
    } = this.props
    const {error, online} = this.state
    return (
      <div className='Sidebar'>
        {outstandingRequests > 0
          ? <div className='Sidebar-spinner'>
            <Icon type='spinner' className='fa-spin' />
          </div>
          : <Link
            title={messages.nav.regions}
            to='/'
            className='Sidebar-logo'
          />}

        {regionId && regionId !== CREATING_ID &&
          <div>
            <SidebarNavItem
              active={isRegionPath(currentPath)}
              icon='cubes'
              text={messages.nav.projects}
              href={`/regions/${regionId}`}
            />
            <SidebarNavItem
              active={paths.editRegion.exec(currentPath)}
              icon='gear'
              text={messages.nav.regionSettings}
              href={`/regions/${regionId}/edit`}
            />
            <SidebarNavItem
              active={isBundlePath(currentPath)}
              icon='database'
              text={messages.nav.gtfsBundles}
              href={`/regions/${regionId}/bundles`}
            />
            <SidebarNavItem
              active={isOpportunitiesPath(currentPath)}
              icon='th'
              text={messages.nav.opportunityDatasets}
              href={`/regions/${regionId}/opportunities`}
            />
          </div>}

        {regionId &&
          projectId &&
          <div>
            <SidebarNavItem
              active={isEditProjectPath(currentPath)}
              icon='pencil'
              text={messages.nav.editModifications}
              href={`/projects/${projectId}`}
            />
            <SidebarNavItem
              active={isAnalysisPath(currentPath)}
              icon='area-chart'
              text={messages.nav.analyze}
              href={`/projects/${projectId}/analysis`}
            />
            <SidebarNavItem
              active={isRegionalPath(currentPath)}
              icon='server'
              text='Regional Analysis'
              href={`/projects/${projectId}/regional`}
            />
          </div>}

        <div className='Sidebar-bottom'>
          {username &&
            <SidebarNavItem
              icon='sign-out'
              text={`${messages.authentication.logOut} — ${sprintf(messages.authentication.username, username)}`}
              href='/logout'
            />}
          <SidebarNavItem
            icon='question-circle'
            text='Help and Documentation'
            href='http://docs.analysis.conveyal.com/'
          />

          {error &&
            <SidebarNavItem danger icon='exclamation-circle' text={error} />}

          {!online &&
            <SidebarNavItem
              danger
              icon='wifi'
              text={messages.nav.notConnectedToInternet}
            />}
        </div>
      </div>
    )
  }
}

function SidebarNavItem ({active, icon, href, text, ...props}) {
  const className = classnames('Sidebar-navItem', {active, ...props})
  const isAbsoluteUrl = href && href.startsWith('http')
  return (
    <Tip
      className={className}
      tip={text}
    >
      {href &&
        !isAbsoluteUrl &&
        <Link to={href} className='Sidebar-navItem-contents'>
          <ItemContents icon={icon} text={text} />
        </Link>}
      {href &&
        isAbsoluteUrl &&
        <a href={href} target='_blank' className='Sidebar-navItem-contents'>
          <ItemContents icon={icon} text={text} />
        </a>}
      {!href &&
        <span className='Sidebar-navItem-contents'>
          <ItemContents icon={icon} text={text} />
        </span>}
    </Tip>
  )
}

const ItemContents = ({icon, text}) => (
  <span>
    <Icon type={icon} />
    <span className='Sidebar-navItem-text'>
      {' '}{text}
    </span>
  </span>
)
