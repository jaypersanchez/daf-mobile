import 'react-native'
import React from 'react'
import Credential from '../Credential'
import { render } from 'react-native-testing-library'

const sertoVerifiableCredential = {
  iss: 'Serto Identity Platform',
  sub: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
  iat: 1562769371,
  exp: 1579478400,
  claim: {
    'Serto ID': {
      name: 'Sarah Adamson',
      dateOfBirth: '22-01-75',
      country: 'USA',
      children: [
        {
          name: 'Bob',
          age: 4,
        },
        {
          name: 'Alice',
          age: 9,
        },
      ],
    },
  },
  vc: [],
}

describe('Credential', () => {
  it('renders correctly with data', () => {
    const navigation = {
      navigate: jest.fn(),
      getParam: jest
        .fn()
        .mockReturnValue({ ...sertoVerifiableCredential, type: 'Some VC' }),
    }
    //@ts-ignore
    const tree = render(<Credential navigation={navigation} />).toJSON()

    expect(navigation.getParam).toBeCalled()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly without a type', () => {
    const navigation = {
      navigate: jest.fn(),
      getParam: jest.fn().mockReturnValue(sertoVerifiableCredential),
    }
    //@ts-ignore
    const tree = render(<Credential navigation={navigation} />).toJSON()

    expect(navigation.getParam).toBeCalled()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly without data', () => {
    const navigation = {
      navigate: jest.fn(),
      getParam: jest.fn().mockReturnValue(null),
    }
    //@ts-ignore
    const tree = render(<Credential navigation={navigation} />).toJSON()

    expect(navigation.getParam).toBeCalled()
    expect(tree).toMatchSnapshot()
  })
})
