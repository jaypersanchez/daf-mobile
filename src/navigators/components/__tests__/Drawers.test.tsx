import 'react-native'
import React from 'react'
import Drawer from '../Drawer'
import { render } from 'react-native-testing-library'

describe('Navigation', () => {
  it('renders right drawer correctly', () => {
    const onPress = jest.fn()
    const tree = render(
      <Drawer onItemPress={onPress} activeItemkey={'TEST_KEY'} />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
