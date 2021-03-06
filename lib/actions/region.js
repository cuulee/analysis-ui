// @flow
import fetch from '@conveyal/woonerf/fetch'
import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'

import {setBundles} from './'
import {setCenter as setMapCenter} from './map'
import {setAll as setProjects} from './project'
import timeout from '../utils/timeout'

import OpportunityDatasets from '../modules/opportunity-datasets'

import type {Bookmark, Region} from '../types'

const setOpportunityDatasetsIfRequired = (region: Region) =>
  region.opportunityDatasets && region.opportunityDatasets.length > 0
    ? OpportunityDatasets.actions.setOpportunityDatasets(region.opportunityDatasets)
    : () => {}

function createFormData (region, customOpenStreetMapData) {
  const formData = new window.FormData()
  formData.append('region', JSON.stringify(region))
  if (customOpenStreetMapData) {
    formData.append('customOpenStreetMapData', customOpenStreetMapData)
  }
  return formData
}

export const create = ({
  region,
  customOpenStreetMapData
}: {
  region: Region,
  customOpenStreetMapData?: File
}) => fetch({
  url: '/api/region',
  options: {
    body: createFormData(region, customOpenStreetMapData),
    method: 'post'
  },
  next: (response) => [
    setLocally(response.value),
    awaitLoad(response.value._id, () =>
      push(`/regions/${response.value._id}`)
    )
  ]
})

export const save = ({
  region,
  customOpenStreetMapData
}: {
  region: Region,
  customOpenStreetMapData?: File
}) => fetch({
  url: `/api/region/${region._id}`,
  options: {
    body: createFormData(region, customOpenStreetMapData),
    method: 'put'
  },
  next: (response) => [
    setLocally(response.value),
    awaitLoad(response.value._id, () =>
      push(`/regions/${response.value._id}`)
    )
  ]
})

export const deleteLocally = createAction('delete region')
export const deleteRegion = (_id: string) =>
  fetch({
    options: {
      method: 'delete'
    },
    url: `/api/region/${_id}`,
    next: () => [deleteLocally(_id), push('/')]
  })

export const load = (id: string) =>
  fetch({
    url: `/api/region/${id}`,
    next (response) {
      const region = response.value
      return [
        setLocally({...region, bundles: [], projects: []}),
        setOpportunityDatasetsIfRequired(region),
        setMapCenter([
          (region.bounds.west + region.bounds.east) / 2,
          (region.bounds.north + region.bounds.south) / 2
        ]),
        setBundles(region.bundles),
        setProjects(region.projects)
      ]
    }
  })

export const awaitLoad = (_id: string, next: () => void) =>
  fetch({
    url: `/api/region/${_id}`,
    next (response) {
      if (response.value.statusCode !== 'DONE') {
        return [
          setLocally(response.value),
          timeout(5000).then(() => awaitLoad(_id, next))
        ]
      } else {
        return [
          setLocally(response.value),
          setOpportunityDatasetsIfRequired(response.value),
          next()
        ]
      }
    }
  })

export const loadAll = () =>
  fetch({
    url: '/api/region',
    next: (response) => setAll(response.value)
  })

export const setAll = createAction('set all regions')
export const setLocally = createAction('set region')
export const clearCurrentRegion = createAction('clear current region')

const createBookmarkLocally = createAction('create bookmark')
export const createBookmark = (bookmark: Bookmark) => [
  fetch({
    url: `/api/region/${bookmark.regionId}/bookmark`,
    options: {
      body: bookmark,
      method: 'post'
    },
    next: (response) => createBookmarkLocally(response.value)
  })
]
