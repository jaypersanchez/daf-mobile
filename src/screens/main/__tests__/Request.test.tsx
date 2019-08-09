import 'react-native'
import React from 'react'
import Request from '../Request'
import { render } from 'react-native-testing-library'

const navigation = {
  goBack: jest.fn(),
}

it('renders correctly', () => {
  // @ts-ignore
  const tree = render(<Request navigation={navigation} />).toJSON()
  expect(tree).toMatchSnapshot()
})
