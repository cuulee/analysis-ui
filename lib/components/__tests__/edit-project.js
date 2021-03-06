// @flow

import renderer from 'react-test-renderer'
import React from 'react'

import EditProject from '../edit-project'
import {mockBundle, mockProject} from '../../utils/mock-data'

describe('Component > EditProject', () => {
  it('renders correctly', () => {
    const closeFn = jest.fn()
    const createFn = jest.fn()
    const goToCreateBundleFn = jest.fn()
    const saveFn = jest.fn()
    const tree = renderer
      .create(
        <EditProject
          bundleId={mockBundle._id}
          bundleName={mockBundle.name}
          bundles={[mockBundle]}
          close={closeFn}
          create={createFn}
          goToCreateBundle={goToCreateBundleFn}
          isEditing={false}
          name={mockProject.name}
          project={mockProject}
          regionId={mockProject.regionId}
          save={saveFn}
          variants={[]}
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
    expect(closeFn).not.toBeCalled()
    expect(createFn).not.toBeCalled()
    expect(goToCreateBundleFn).not.toBeCalled()
    expect(saveFn).not.toBeCalled()
  })
})
