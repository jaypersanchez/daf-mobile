/**
 *
 */
import React, { useState } from 'react'
import { TextInput, ActivityIndicator } from 'react-native'
import {
  Container,
  Text,
  Screen,
  Constants,
  Button,
  Modal,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { useMutation } from '@apollo/react-hooks'
import { SEND_JWT_MUTATION, SIGN_VC_MUTATION } from '../../lib/graphql/queries'

const CreateFirstCredential: React.FC<NavigationStackScreenProps> = ({
  navigation,
}) => {
  const did = navigation.getParam('did')
  const fetchMessages = navigation.getParam('fetchMessages')

  const [name, setName] = useState()
  const [sending, setSending] = useState(false)

  const [actionSendJwt] = useMutation(SEND_JWT_MUTATION, {
    onCompleted: response => {
      if (response && response.actionSendJwt) {
        setSending(false)

        fetchMessages()
        navigation.goBack()
      }
    },
  })
  const [actionSignVc] = useMutation(SIGN_VC_MUTATION, {
    onCompleted: response => {
      if (response && response.actionSignVc) {
        setSending(true)
        actionSendJwt({
          variables: {
            from: did,
            to: did,
            jwt: response.actionSignVc,
          },
        })
      }
    },
  })

  const signVc = () => {
    actionSignVc({
      variables: {
        did,
        data: {
          sub: did,
          vc: {
            context: ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
            credentialSubject: {
              name,
            },
          },
        },
      },
    })
  }

  return (
    <Modal scrollEnabled>
      <Container padding>
        <Text type={Constants.TextTypes.H3} bold>
          Success!
        </Text>
        <Container marginTop={10}>
          <Text type={Constants.TextTypes.Body}>
            You created an <Text bold>ethr-did</Text> identity
          </Text>
        </Container>

        <Container backgroundColor={'#D3F4DF'} padding br={5} margin>
          <Text textStyle={{ fontFamily: 'menlo' }}>{did}</Text>
        </Container>
        <Container marginTop marginBottom>
          {sending ? (
            <Container
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <ActivityIndicator />
              <Container marginLeft>
                <Text type={Constants.TextTypes.Body}>
                  Issuing your credential
                </Text>
              </Container>
            </Container>
          ) : (
            <Text type={Constants.TextTypes.Body}>
              Now let's create your first credential by issuing a{' '}
              <Text textStyle={{ fontStyle: 'italic' }} bold>
                name
              </Text>{' '}
              credential to yourself...
            </Text>
          )}
        </Container>
        <Container marginTop marginBottom>
          <Text type={Constants.TextTypes.Body}>Enter your name</Text>
        </Container>
        <Container disabled={sending} background={'secondary'} padding br={5}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={'Name'}
            autoCorrect={false}
            autoCapitalize={'none'}
            autoCompleteType={'off'}
          />
        </Container>
        <Container marginTop={50}>
          <Container>
            <Button
              disabled={sending || !name}
              fullWidth
              block={Constants.ButtonBlocks.Filled}
              type={Constants.BrandOptions.Primary}
              buttonText={'Issue'}
              onPress={() => signVc()}
            />
          </Container>
        </Container>
      </Container>
    </Modal>
  )
}

export default CreateFirstCredential
