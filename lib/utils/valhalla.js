// @flow
import type {LonLat} from '../types'

import {decode as decodePolyline} from '@mapbox/polyline'
import fetch from 'isomorphic-fetch'

const MAPZEN_TURN_BY_TURN_KEY = String(process.env.MAPZEN_TURN_BY_TURN_KEY)
const COORDINATE_DIVISOR = 10

export async function route (start: LonLat, end: LonLat) {
  const json = {
    costing: 'bus',
    locations: [{lat: start.lat, lon: start.lon}, {lat: end.lat, lon: end.lon}]
  }
  const response = await fetch(
    `https://valhalla.mapzen.com/route?json=${JSON.stringify(json)}&api_key=${MAPZEN_TURN_BY_TURN_KEY}`
  )
  return response.json()
}

export async function polyline (start: LonLat, end: LonLat) {
  const json = await route(start, end)
  return decodePolyline(json.trip.legs[0].shape).map(c => [
    c[1] / COORDINATE_DIVISOR,
    c[0] / COORDINATE_DIVISOR
  ]) // Mapzen or Mapbox is encoding/decoding wrong?
}
