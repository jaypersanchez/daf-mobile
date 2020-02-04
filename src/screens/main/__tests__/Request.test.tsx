import 'react-native'
import React from 'react'
import Request from '../Request'
import { render, fireEvent, act } from 'react-native-testing-library'
import { Toaster } from '@kancha/kancha-ui'
import { MockedProvider, wait } from '@apollo/react-testing'
import { SIGN_VP, SEND_JWT_MUTATION } from '../../../lib/graphql/queries'

const mockMessage = {
  id: 'testMsgID',
  threadId: null,
  type: 'w3c.vc',
  timestamp: 1579723999,
  sender: { did: 'did:ethr:0x123', shortId: 'senderTestID', profileImage: '' },
  receiver: {
    did: 'did:ethr:0x456',
    shortId: 'receiverTestID',
    profileImage: '',
  },
  vc: [
    {
      hash: 'test',
      rowId: '1',
      jwt: 'test',
      iss: { did: 'test', profileImage: '', shortId: 'test' },
      sub: { did: 'test', profileImage: '', shortId: 'test' },
      fields: [{ type: 'name', value: 'test', isObj: false }],
    },
  ],
  sdr: [
    {
      hash: 'test',
      rowId: '1',
      iss: { did: 'test', shortId: 'Jane', profileImage: '' },
      sub: { did: 'test', shortId: 'Jane', profileImage: '' },
      jwt: 'test',
      fields: [{ type: 'name', value: 'test', isObj: false }],
      essential: true,
      vc: [
        {
          hash: 'test',
          rowId: '1',
          jwt: 'test',
          iss: { did: 'test', profileImage: '', shortId: 'test' },
          sub: { did: 'test', profileImage: '', shortId: 'test' },
          fields: [{ type: 'name', value: 'test', isObj: false }],
        },
      ],
    },
  ],
}

const mockSigningPayload = {
  variables: {
    did: mockMessage.receiver.did,
    data: {
      aud: mockMessage.sender.did,
      tag: null,
      vp: {
        context: ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        verifiableCredential: ['test'],
      },
    },
  },
}

describe('Request Component', () => {
  it('should do stuff', () => {})
  // it('renders correctly', () => {
  //   // @ts-ignore
  //   const tree = render(<Request navigation={navigation} />).toJSON()
  //   expect(tree).toMatchSnapshot()
  // })
  // it('should fire the go back event on button taps', () => {
  //   jest.useFakeTimers()
  //   Toaster.confirm = jest.fn()
  //   // @ts-ignore
  //   const { getByText } = render(<Request navigation={navigation} />)
  //   fireEvent.press(getByText(/Accept/i))
  //   expect(navigation.goBack).toBeCalled()
  //   // expect(setTimeout).toHaveBeenCalled()
  //   // expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500)
  //   jest.runAllTimers()
  //   // expect(Toaster.confirm).toHaveBeenCalled()
  //   fireEvent.press(getByText(/Decline/i))
  //   expect(navigation.goBack).toBeCalled()
  // })
  // // Hardcoded names = Jane, Jenny, Jill

  it('test buttons', async () => {
    let signMutationCalled = false
    let sendMutationCalled = false

    const navigation = {
      goBack: jest.fn(),
      getParam: jest.fn(param => {
        if (param === 'requestMessage') {
          return mockMessage
        } else if (param === 'viewerDid') {
          return 'did:ethr:0x456'
        }
      }),
      //getParam: jest.fn().mockReturnValue(mockMessage),
    }

    const mocks = [
      {
        request: {
          query: SIGN_VP,
          ...mockSigningPayload,
        },
        result: () => {
          signMutationCalled = true
          return { data: { actionSignVp: 'sampleJWT' } }
        },
      },
      {
        request: {
          query: SEND_JWT_MUTATION,
          variables: {
            to: mockMessage.sender.did,
            from: mockMessage.receiver.did,
            jwt: 'sampleJWT',
          },
        },
        result: () => {
          sendMutationCalled = true
          return { data: { actionSendJwt: 200 } }
        },
      },
    ]

    const { getByText, getAllByText, unmount } = render(
      // @ts-ignore
      <MockedProvider mocks={mocks} addTypename={false}>
        <Request navigation={navigation} />
      </MockedProvider>,
    )

    expect(getAllByText('Share')).toHaveLength(1)

    await act(async () => {
      fireEvent.press(getByText('Share'))
      await wait(500)
    })

    fireEvent.press(getByText('Later'))

    expect(signMutationCalled).toBeTruthy()
    expect(sendMutationCalled).toBeTruthy()
    expect(navigation.goBack).toHaveBeenCalledTimes(2)
    unmount()
  })

  it('render properly', async () => {
    const navigation = {
      goBack: jest.fn(),
      getParam: jest.fn(param => {
        if (param === 'requestMessage') {
          return mockMessage
        } else if (param === 'viewerDid') {
          return 'did:ethr:0x456'
        }
      }),
      //getParam: jest.fn().mockReturnValue(mockMessage),
    }

    const tree = render(
      // @ts-ignore
      <MockedProvider mocks={[]} addTypename={false}>
        <Request navigation={navigation} />
      </MockedProvider>,
    )
    expect(tree.toJSON()).toMatchSnapshot()
    tree.unmount()
  })

  it('render properly with missing fields', async () => {
    let mockMessageMissingVc = mockMessage
    mockMessageMissingVc.sdr[0].vc.pop()
    const navigation = {
      goBack: jest.fn(),
      getParam: jest.fn(param => {
        if (param === 'requestMessage') {
          return mockMessageMissingVc
        } else if (param === 'viewerDid') {
          return 'did:ethr:0x456'
        }
      }),
      //getParam: jest.fn().mockReturnValue(mockMessage),
    }

    const tree = render(
      // @ts-ignore
      <MockedProvider mocks={[]} addTypename={false}>
        <Request navigation={navigation} />
      </MockedProvider>,
    )
    expect(tree.toJSON()).toMatchSnapshot()
    tree.unmount()
  })
})
