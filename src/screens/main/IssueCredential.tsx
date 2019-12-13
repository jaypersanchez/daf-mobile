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
  Icon,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { Colors } from '../../theme'
import { useMutation } from 'react-apollo'
import {
  SEND_JWT_MUTATION,
  SIGN_VC_MUTATION,
  GET_VIEWER_CREDENTIALS,
} from '../../lib/graphql/queries'

interface Field {
  type: string
  value: any
}

const claimToObject = (arr: any[]) => {
  return arr.reduce(
    (obj, item) => Object.assign(obj, { [item.type]: item.value }),
    {},
  )
}

const IssueCredential: React.FC<NavigationStackScreenProps> = ({
  navigation,
}) => {
  const did = navigation.getParam('did', 'ethr:did:0x1fe34ks')
  const [claimType, setClaimType] = useState()
  const [claimValue, setClaimValue] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [sending, setSending] = useState(false)
  const [fields, updateFields] = useState<Field[]>([
    { type: 'name', value: 'Mozart' },
  ])
  const updateClaimFields = (field: Field) => {
    const claimTypes = fields.map((field: Field) => field.type)
    const newfields = fields.concat([field])
    setErrorMessage('')

    if (!field.type) {
      setErrorMessage('Enter claim type')
      return
    }

    if (!field.value) {
      setErrorMessage('Enter claim value')
      return
    }

    if (claimTypes.includes(field.type)) {
      setErrorMessage('Claim type already exists')
      return
    }

    updateFields(newfields)
    setClaimValue('')
    setClaimType('')
  }

  const removeClaimField = (index: number) => {
    const updatedClaims = fields.filter((item: any, i: number) => i !== index)
    updateFields(updatedClaims)
  }

  const [actionSendJwt] = useMutation(SEND_JWT_MUTATION, {
    onCompleted: response => {
      if (response && response.actionSendJwt) {
        setSending(false)

        navigation.dismiss()
      }
    },
    refetchQueries: [{ query: GET_VIEWER_CREDENTIALS }],
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

  const signVc = (claimFields: Field[]) => {
    actionSignVc({
      variables: {
        did,
        data: {
          sub: did,
          vc: {
            context: ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
            credentialSubject: {
              ...claimToObject(claimFields),
            },
          },
        },
      },
    })
  }

  return (
    <Screen scrollEnabled background={'primary'}>
      <Container padding>
        <Text type={Constants.TextTypes.H2} bold>
          Issue Credential
        </Text>
        <Container marginTop={10}>
          <Text type={Constants.TextTypes.Body}>
            You are issuing a credential from:
          </Text>
        </Container>
        <Container
          backgroundColor={'#D3F4DF'}
          padding
          br={5}
          marginTop
          marginBottom
        >
          <Text textStyle={{ fontFamily: 'menlo' }}>{did}</Text>
        </Container>

        <Container background={'secondary'} padding marginBottom br={5}>
          {fields.map((field: Field, index: number) => {
            return (
              <Container
                key={field.type + index}
                paddingBottom={5}
                flexDirection={'row'}
                alignItems={'center'}
              >
                <Container>
                  <Text textStyle={{ fontFamily: 'menlo' }}>
                    <Text type={Constants.TextTypes.SubTitle}>
                      {field.type}:
                    </Text>{' '}
                    {field.value}
                  </Text>
                </Container>
                <Container marginLeft>
                  <Button
                    iconButton
                    small
                    icon={
                      <Icon
                        size={16}
                        color={Colors.WARN}
                        icon={{
                          name: 'ios-remove-circle',
                          iconFamily: 'Ionicons',
                        }}
                      />
                    }
                    onPress={() => removeClaimField(index)}
                  />
                </Container>
              </Container>
            )
          })}
        </Container>
        <Container
          background={'primary'}
          padding
          br={5}
          marginBottom
          dividerBottom
        >
          <TextInput
            value={claimType}
            onChangeText={setClaimType}
            placeholder={'Enter claim type'}
            autoCorrect={false}
            autoCapitalize={'none'}
            autoCompleteType={'off'}
          />
        </Container>
        <Container background={'primary'} padding br={5} dividerBottom>
          <TextInput
            value={claimValue}
            onChangeText={setClaimValue}
            placeholder={'Enter claim value'}
            autoCorrect={false}
            autoCapitalize={'none'}
            autoCompleteType={'off'}
          />
        </Container>
        <Container padding alignItems={'flex-end'}>
          <Button
            iconButton
            buttonText={'Add claim'}
            icon={
              <Icon
                color={Colors.BRAND}
                icon={{ name: 'ios-add-circle', iconFamily: 'Ionicons' }}
              />
            }
            onPress={() =>
              updateClaimFields({ type: claimType, value: claimValue })
            }
          />
        </Container>
        <Container alignItems={'center'}>
          <Text warn>{errorMessage && errorMessage}</Text>
          <Text>{sending && 'Issuing credential...'}</Text>
        </Container>
        <Container marginTop={20}>
          <Container>
            <Button
              fullWidth
              block={Constants.ButtonBlocks.Filled}
              type={Constants.BrandOptions.Primary}
              buttonText={'Issue'}
              onPress={() => signVc(fields)}
            />
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}

export default IssueCredential
