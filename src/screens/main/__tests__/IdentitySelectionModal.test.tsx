import 'react-native'
import React from 'react'
import IdentitySelectionModal from '../IdentitySelectionModal'
import { render } from 'react-native-testing-library'

const navigation = {
  goBack: jest.fn(),
}

it('renders correctly', () => {
  const tree = render(
    // @ts-ignore
    <IdentitySelectionModal navigation={navigation} />,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
