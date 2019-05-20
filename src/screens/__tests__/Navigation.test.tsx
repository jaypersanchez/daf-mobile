import 'react-native'
import React from 'react'
import Navigation from '../Navigation'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<Navigation />).toJSON()
  expect(tree).toMatchSnapshot()
})
