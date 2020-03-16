import React, { useState, useEffect } from 'react'
import {
  Container,
  Screen,
  Button,
  Constants,
  Banner,
  RequestItem,
  Toaster,
  Typings,
  Indicator,
  Text,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { Colors } from '../../theme'
import { useMutation } from 'react-apollo'
import { SIGN_VP, SEND_JWT_MUTATION } from '../../lib/graphql/queries'
import { ActivityIndicator, ActivityIndicatorBase } from 'react-native'
import navigationService from 'Serto/src/navigators/navigationService'

// tslint:disable-next-line:no-var-requires
const bannerImage = require('../../assets/images/abstract-blurred-gradient.jpg')

interface ValidationState {
  [index: string]: {
    required: boolean
    jwt: string | null
  }
}

const Component: React.FC<NavigationStackScreenProps> = props => {
  const requestMessage = props.navigation.getParam('requestMessage')
  const viewerDid = props.navigation.getParam('viewerDid')
  const [sending, updateSending] = useState<boolean>(false)
  const [selected, updateSelected] = useState<ValidationState>({})
  const [formValid, setValid] = useState(true)

  const checkValidity = () => {
    let valid = true
    Object.keys(selected).map(key => {
      if (selected[key].required && !selected[key].jwt) {
        valid = false
      }
    })

    setValid(valid)
  }

  const [actionSendJwt] = useMutation(SEND_JWT_MUTATION, {
    onCompleted: response => {
      if (response.actionSendJwt) {
        updateSending(false)
        Toaster.confirm(
          'Response sent',
          `Your response was sent to ${requestMessage.sender.shortId}`,
        )
        props.navigation.goBack()
      }
    },
    onError: error => {
      console.log(error)
    },
  })
  const [actionSignVp] = useMutation(SIGN_VP, {
    onCompleted: response => {
      if (response.actionSignVp) {
        updateSending(true)
        actionSendJwt({
          variables: {
            to: requestMessage.sender.did,
            from: viewerDid,
            jwt: response.actionSignVp,
          },
        })
      }
    },
    onError: error => {
      console.log(error)
    },
  })

  const accept = () => {
    if (formValid) {
      const selectedVp = Object.keys(selected)
        .map(key => selected[key].jwt)
        .filter(item => item)

      const payload = {
        variables: {
          did: viewerDid,
          data: {
            aud: requestMessage.sender.did,
            tag: requestMessage.threadId,
            vp: {
              context: ['https://www.w3.org/2018/credentials/v1'],
              type: ['VerifiablePresentation'],
              verifiableCredential: selectedVp,
            },
          },
        },
      }
      actionSignVp(payload)
    }
  }

  const onSelectItem = (
    id: string | null,
    jwt: string | null,
    claimType: string,
  ) => {
    const updatedSelection = {
      ...selected,
      [claimType]: { ...selected[claimType], jwt },
    }

    updateSelected(updatedSelection)
  }

  useEffect(() => {
    checkValidity()
  }, [selected])

  useEffect(() => {
    let defaultSelected: ValidationState = {}
    requestMessage.sdr.map((sdr: any) => {
      if (sdr && sdr.essential) {
        if (sdr.vc.length) {
          defaultSelected[sdr.claimType] = {
            required: true,
            jwt: sdr.vc[0].jwt,
          }
        } else {
          defaultSelected[sdr.claimType] = {
            required: true,
            jwt: null,
          }
          setValid(false)
        }
      }
    })
    updateSelected(defaultSelected)
  }, [])

  return (
    <Screen
      safeAreaBottom={true}
      safeAreaBottomBackground={Colors.WHITE}
      scrollEnabled={true}
      footerDivider={true}
      footerComponent={
        <Container
          paddingHorizontal={true}
          paddingBottom={true}
          backgroundColor={Colors.WHITE}
        >
          {sending && (
            <Container
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <ActivityIndicator size={'small'} />
              <Container marginLeft>
                <Text>Sending response</Text>
              </Container>
            </Container>
          )}
          <Container alignItems={'center'} paddingBottom>
            <Text warn>{formValid ? '' : 'There are some missing fields'}</Text>
          </Container>
          <Container flexDirection={'row'}>
            <Container flex={1}>
              <Button
                block={Constants.ButtonBlocks.Clear}
                type={Constants.BrandOptions.Warning}
                buttonText={'Later'}
                onPress={() => props.navigation.goBack()}
              />
            </Container>
            <Container flex={1}>
              <Button
                disabled={sending || !formValid}
                block={Constants.ButtonBlocks.Filled}
                type={Constants.BrandOptions.Primary}
                buttonText={'Share'}
                onPress={accept}
                shadowOpacity={0.2}
              />
            </Container>
          </Container>
        </Container>
      }
    >
      <Container>
        <Banner
          title={requestMessage.sender.shortId}
          subTitle={'Subtitle'}
          issuer={requestMessage.sender}
          backgroundImage={bannerImage}
        />
        <Indicator
          text={'Share your data with ' + requestMessage.sender.shortId}
        />
        <Container>
          {requestMessage.sdr.map((sdrRequestField: any, index: number) => {
            return (
              <RequestItem
                closeAfterSelect={false}
                key={sdrRequestField.claimType + index}
                claimType={sdrRequestField.claimType}
                reason={sdrRequestField.reason}
                issuers={sdrRequestField.iss}
                credentials={sdrRequestField.vc}
                required={sdrRequestField.essential}
                onSelectItem={onSelectItem}
                onPressVC={() =>
                  props.navigation.navigate('Credential', {
                    sharingModeEnabled: false,
                    credentials: sdrRequestField.vc,
                    credentialIndex: 0,
                  })
                }
              />
            )
          })}
        </Container>
      </Container>
    </Screen>
  )
}

export default Component
