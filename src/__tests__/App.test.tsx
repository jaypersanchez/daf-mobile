import 'react-native'
import React from 'react'
<<<<<<< HEAD:src/__tests__/App.test.tsx
import App from '../App'
=======
import Settings from '../Developer'
>>>>>>> Update Developer screen:src/screens/__tests__/Settings.test.tsx
import { render } from 'react-native-testing-library'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = render(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})
