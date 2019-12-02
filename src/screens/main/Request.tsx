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
import { SIGN_VP } from '../../lib/graphql/queries'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')
// tslint:disable-next-line:no-var-requires
const bannerImage = require('../../assets/images/space-x-banner.jpg')

const Component: React.FC<NavigationStackScreenProps> = props => {
  const requestMessage = props.navigation.getParam('requestMessage')
  const [selected, updateSelected] = useState<{ [index: string]: string }>({})
  const [actionSignVp] = useMutation(SIGN_VP)
  const accept = () => {
    // actionSignVp({variables: {

    // }})

    props.navigation.goBack()
  }

  // console.log('!REQUEST_MESSAGE', requestMessage)

  const selectItem = (jwt: string, claimType: string) => {
    // console.log(jwt, claimType)
    const updatedSelection = { ...selected, [claimType]: jwt }

    updateSelected(updatedSelection)
  }

  useEffect(() => {
    console.log(
      'SELECTED_ITEMS',
      Object.keys(selected)
        .map(key => selected[key])
        .filter(item => item !== 'NOSHARE'),
    )
  }, [selected])

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
                buttonText={'Accept'}
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
          subTitle={'Blast off to the Moon'}
          avatar={avatar1}
          backgroundImage={bannerImage}
        />
        <Indicator text={'Share your data ' + requestMessage.iss.shortId} />
        <Container>
          {requestMessage.sdr.map((requestField: any, index: number) => {
            return (
              <RequestItem
                key={index}
                claimType={requestField.claimType}
                options={requestField.vc.map((vc: any, index: number) => {
                  return {
                    id: vc.jwt,
                    iss: vc.iss.shortId,
                    property: vc.type,
                    value: vc.value,
                    selected: requestField.essential && index === 0,
                  }
                })}
                onSelectItem={(jwt: string, claimType: string) =>
                  selectItem(jwt, claimType)
                }
                required={requestField.essential}
              />
            )
          })}
        </Container>
      </Container>
    </Screen>
  )
}

export default Component
