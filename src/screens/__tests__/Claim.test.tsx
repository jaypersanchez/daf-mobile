import 'react-native'
import React from 'react'
import Claim from '../settings/Claim'
import { render } from 'react-native-testing-library'

const navigation = {
  goBack: jest.fn(),
}

it('renders correctly', () => {
  // @ts-ignore
  const tree = render(<Claim navigation={navigation} />).toJSON()
  expect(tree).toMatchSnapshot()
})
