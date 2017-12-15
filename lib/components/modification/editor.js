// @flow
import Icon from '@conveyal/woonerf/components/icon'
import debounce from 'lodash/debounce'
import React, {Component} from 'react'

import {UPDATE_DELAY_MS} from '../../constants'
import {Button} from '../buttons'
import InnerDock from '../inner-dock'
import {IconLink} from '../link'
import AddTripPattern from '../../containers/add-trip-pattern'
import AdjustDwellTime from '../../containers/adjust-dwell-time'
import AdjustSpeed from '../../containers/adjust-speed'
import ConvertToFrequency from '../../containers/convert-to-frequency'
import RemoveStops from '../../containers/remove-stops'
import RemoveTrips from '../../containers/remove-trips'
import Reroute from '../../containers/reroute'
import {Checkbox, Group, Text, TextArea} from '../input'
import {Body as PanelBody} from '../panel'
import messages from '../../utils/messages'

import type {MapState, Modification} from '../../types'

type Props = {
  allVariants: string[],
  feedIsLoaded: boolean,
  modification?: Modification,
  modificationId: string,
  projectId: string,

  clearActive: () => void,
  copyModification: () => void,
  removeModification: () => void,
  setActive: () => void,
  setMapState: (MapState) => void,
  update: (modification: any) => void,
  updateAndRetrieveFeedData: (modification: any) => void
}

const modificationTypeToComponentMap = {
  'add-trip-pattern': AddTripPattern,
  'adjust-dwell-time': AdjustDwellTime,
  'adjust-speed': AdjustSpeed,
  'convert-to-frequency': ConvertToFrequency,
  'remove-stops': RemoveStops,
  'remove-trips': RemoveTrips,
  reroute: Reroute
}

const ModificationType = (props) => {
  const M = modificationTypeToComponentMap[props.type]
  return <M {...props} />
}

export default class ModificationEditor extends Component {
  props: Props

  state = {
    showDescription: !!(this.props.modification && this.props.modification.description),
    showEditName: false
  }

  componentDidMount () {
    this.props.setActive()
  }

  componentWillUnmount () {
    this.props.clearActive()
  }

  _onNameChange = (e: Event & {currentTarget: HTMLInputElement}) => {
    this._update({name: e.currentTarget.value})
  }

  _onDescriptionChange = (e: Event & {currentTarget: HTMLInputElement}) => {
    this._update({description: e.currentTarget.value})
  }

  _onAddDescription = () => {
    this.setState({showDescription: true})
  }

  _remove = () => {
    if (window.confirm(messages.modification.deleteConfirmation)) {
      this.props.removeModification()
    }
  }

  _removeFeed = () => {
    const {modification} = this.props
    if (modification) {
      const update: any = {feed: null}
      if (modification.hasOwnProperty('routes')) update.routes = null
      if (modification.hasOwnProperty('stops')) update.stops = null
      if (modification.hasOwnProperty('trips')) update.trips = null
      if (modification.hasOwnProperty('fromStop')) update.fromStop = null
      if (modification.hasOwnProperty('toStop')) update.toStop = null
      this._updateAndRetrieveFeedData(update)
    }
  }

  _setVariant = (variantIndex: number, active: boolean) => {
    const {modification} = this.props
    if (modification) {
      const {variants} = modification

      // this is coming from a bitset on the Java side so may be of varying length
      for (let i = 0; i < variants.length; i++) {
        if (variants[i] === undefined) variants[i] = false
      }

      variants[variantIndex] = active

      this._update({
        variants: [...variants]
      })
    }
  }

  _showEditModificationName = () => this.setState({showEditName: true})

  _update = debounce((properties: any) => {
    this.props.update({
      ...this.props.modification,
      ...properties
    })
  }, UPDATE_DELAY_MS)

  _updateAndRetrieveFeedData = debounce((properties: any) => {
    this.props.updateAndRetrieveFeedData({
      ...this.props.modification,
      ...properties
    })
  }, UPDATE_DELAY_MS)

  render () {
    const {
      allVariants,
      copyModification,
      feedIsLoaded,
      modification,
      projectId,
      setMapState
    } = this.props
    const {showDescription, showEditName} = this.state
    return (
      <div>
        <div className='ApplicationDockTitle'>
          <IconLink
            title='Modifications'
            to={`/projects/${projectId}`}
            type='chevron-left'
          />
          {modification ? modification.name : 'Loading...'}

          <IconLink
            className='pull-right'
            onClick={this._remove}
            title={messages.modification.deleteModification}
            type='trash'
          />
          <IconLink
            className='pull-right'
            onClick={copyModification}
            title={messages.modification.copyModification}
            type='copy'
          />
          <IconLink
            className='pull-right'
            onClick={this._showEditModificationName}
            title={messages.modification.editModificationName}
            type='pencil'
          />
        </div>
        <InnerDock>
          {feedIsLoaded
            ? modification
              ? <PanelBody>
                {showEditName &&
                  <Text
                    name='Modification Name'
                    onChange={this._onNameChange}
                    value={modification.name}
                  />}

                {showDescription &&
                <TextArea
                  value={modification.description}
                  onChange={this._onDescriptionChange}
                  label={messages.modification.description}
                />}

                {!showDescription &&
                <Group>
                  <Button block style='info' onClick={this._onAddDescription}>
                    <Icon type='pencil' />
                    {' '}
                    {messages.modification.addDescription}
                  </Button>
                </Group>}

                <ModificationType
                  modification={modification}
                  setMapState={setMapState}
                  type={modification.type}
                  update={this._update}
                  updateAndRetrieveFeedData={this._updateAndRetrieveFeedData}
                />

                <Variants
                  activeVariants={modification.variants}
                  allVariants={allVariants}
                  modificationId={modification._id}
                  setVariant={this._setVariant}
                />
              </PanelBody>
              : <PanelBody>Loading modification...</PanelBody>
            : <PanelBody>
              <p>Loading modification feed...</p>
              <p>{messages.modification.clearBundleInfo}</p>
              <Button block style='warning' onClick={this._removeFeed}><Icon type='times' /> {messages.modification.clearBundleConfirm}</Button>
            </PanelBody>}
        </InnerDock>
      </div>
    )
  }
}

function Variants ({activeVariants, allVariants, modificationId, setVariant}) {
  return (
    <div>
      <h5>{messages.variant.activeIn}</h5>
      <div className='form-inline'>
        {allVariants.map((v, i) => (
          <Checkbox
            checked={activeVariants[i]}
            label={i + 1}
            key={`variant-${i}-modification-${modificationId}`}
            onChange={e => setVariant(i, e.target.checked)}
            title={v}
          />
        ))}
      </div>
    </div>
  )
}
