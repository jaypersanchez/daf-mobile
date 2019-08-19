import 'react-native'
import React from 'react'
import Credential from '../Credential'
import { render } from 'react-native-testing-library'

jest.useFakeTimers()

const navigation = {
  navigate: jest.fn(),
  getParam: jest.fn(),
}

it('renders correctly', () => {
  //@ts-ignore
  const tree = render(<Credential navigation={navigation} />).toJSON()

  expect(tree).toMatchSnapshot()
})
