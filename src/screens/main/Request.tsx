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

// tslint:disable-next-line:no-var-requires
const bannerImage = require('../../assets/images/abstract-blurred-gradient.jpg')

const Component: React.FC<NavigationStackScreenProps> = props => {
  const requestMessage = props.navigation.getParam('requestMessage')
  const viewerDid = props.navigation.getParam('viewerDid')
  const [sending, updateSending] = useState(false)
  const [selected, updateSelected] = useState<{
    [index: string]: string | null
  }>({})
  const [actionSendJwt] = useMutation(SEND_JWT_MUTATION, {
    onCompleted: response => {
      if (response.actionSendJwt) {
        updateSending(false)
        props.navigation.goBack()
      }
    },
  })
  const [actionSignVp] = useMutation(SIGN_VP, {
    onCompleted: response => {
      if (response.actionSignVp) {
        updateSending(true)

        actionSendJwt({
          variables: {
            to: requestMessage.iss.did,
            from: viewerDid,
            jwt: response.actionSignVp,
          },
        })
      }
    },
  })

  const accept = () => {
    const selectedVp = Object.keys(selected)
      .map(key => selected[key])
      .filter(item => item !== 'NOSHARE')

    const payload = {
      variables: {
        did: viewerDid,
        data: {
          aud: requestMessage.iss.did,
          tag: requestMessage.tag,
          vp: {
            context: ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
            verifiableCredential: selectedVp,
          },
        },
      },
    }

    actionSignVp(payload)
  }

  console.log('!REQUEST_MESSAGE', requestMessage)

  const onSelectItem = (
    id: string | null,
    jwt: string | null,
    claimType: string,
  ) => {
    const updatedSelection = { ...selected, [claimType]: jwt }
    updateSelected(updatedSelection)
  }

  useEffect(() => {
    let defaultSelected: { [index: string]: string } = {}
    requestMessage.sdr.map((sdr: any) => {
      if (sdr && sdr.essential && sdr.vc && sdr.vc.fields) {
        defaultSelected[sdr.claimType] = sdr.vc[0].fields[0].jwt
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
          <Container alignItems={'center'} paddingBottom>
            <Text>{sending ? 'Sending...Todo: make prettier ;)' : ''}</Text>
          </Container>
          <Container flexDirection={'row'}>
            <Container flex={1}>
              <Button
                block={Constants.ButtonBlocks.Clear}
                type={Constants.BrandOptions.Warning}
                buttonText={'Decline'}
                onPress={() => props.navigation.goBack()}
              />
            </Container>
            <Container flex={1}>
              <Button
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
          title={requestMessage.iss.shortId}
          subTitle={requestMessage.iss.did}
          issuer={requestMessage.iss}
          backgroundImage={bannerImage}
        />
        <Indicator text={'Share your data ' + requestMessage.iss.shortId} />
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
              />
            )
          })}
        </Container>
      </Container>
    </Screen>
  )
}

export default Component
