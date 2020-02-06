import 'react-native'
import React from 'react'
import Settings from '../../settings/Settings'
import { render, fireEvent } from 'react-native-testing-library'
import { useTranslation } from 'react-i18next' //'../../../__mocks__/react-i18next'

const navigation = {
  navigate: jest.fn(),
}

it('renders correctly', () => {
  // @ts-ignore
  const tree = render(<Settings navigation={navigation} />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('test buttons', () => {
  const { t, i18n } = useTranslation()
  // @ts-ignore
  const tree = render(<Settings navigation={navigation} />)

  fireEvent.press(tree.getByTestId('SHOW_SECRET_BTN'))
  fireEvent.press(tree.getByTestId('MESSAGES_BTN'))
  fireEvent.press(tree.getByTestId('CREATE_CREDENTIAL_BTN'))
  fireEvent.press(tree.getByTestId('CREATE_REQUEST_BTN'))
  fireEvent.press(tree.getByTestId('CONNECTIONS_BTN'))
  fireEvent.press(tree.getByTestId('SIGNER_BTN'))
  expect(navigation.navigate).toHaveBeenCalledTimes(6)

  fireEvent(tree.getByTestId('LANGUAGE_SWITCH_BTN'), 'valueChange', true)
})
