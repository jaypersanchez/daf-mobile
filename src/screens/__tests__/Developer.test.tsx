import 'react-native'
import React from 'react'
import Developer from '../Developer'
import { render } from 'react-native-testing-library'

jest.useFakeTimers()

const navigation = {
  navigate: jest.fn(),
}

it('renders correctly', () => {
  // @ts-ignore
  const tree = render(<Developer navigation={navigation} />).toJSON()
  expect(tree).toMatchSnapshot()
})
