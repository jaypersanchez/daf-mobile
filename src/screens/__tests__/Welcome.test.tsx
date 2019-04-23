import 'react-native'
import React from 'react';
import Welcome from '../Welcome';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<Welcome />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
