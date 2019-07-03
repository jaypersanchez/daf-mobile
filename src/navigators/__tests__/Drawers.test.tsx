import 'react-native'
import React from 'react'
import DrawerLeft from '../DrawerLeft'
import DrawerRight from '../DrawerRight'
import { render } from 'react-native-testing-library'

jest.useFakeTimers()

describe('Navigation', () => {
  it('renders left drawer correctly', () => {
    const onPress = jest.fn()

    const tree = render(
      <DrawerLeft onItemPress={onPress} activeItemkey={'TEST_KEY'} />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders right drawer correctly', () => {
    const onPress = jest.fn()

    const tree = render(
      <DrawerRight onItemPress={onPress} activeItemkey={'TEST_KEY'} />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
