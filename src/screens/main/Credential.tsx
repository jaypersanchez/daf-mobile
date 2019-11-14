import * as React from 'react'
import {
  Container,
  Modal,
  Banner,
  ClaimExplore,
  Typings,
} from '@kancha/kancha-ui'
import { ScrollView } from 'react-native'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import Swiper from 'react-native-swiper'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

// tslint:disable-next-line:no-var-requires
const bannerImage = require('../../assets/images/space-x-banner.jpg')

interface Props extends NavigationStackScreenProps {}

const Credential: React.FC<Props> = ({ navigation }) => {
  const vp: Typings.VerifiableCredential[] = navigation.getParam('vp', null)
  const vc: Typings.VerifiableCredential = navigation.getParam('vc', null)

  return (
    <Modal scrollEnabled={vc !== null}>
      {vc && (
        <Container>
          <Banner
            size={'small'}
            title={vc.type || ''}
            subTitle={vc.iss}
            avatar={avatar1}
            backgroundImage={bannerImage}
          />
          <ClaimExplore
            claim={vc.claim}
            jwt={'jwt.jwt.jwt'}
            qrText={'Present for scanning'}
            // @ts-ignore - Need to fix these
            revoked={vc.revoked}
            // @ts-ignore
            exp={vc.exp}
          />
        </Container>
      )}
      {vp && (
        <Swiper removeClippedSubviews={false}>
          {vp &&
            vp.map((vc, i) => {
              return (
                <ScrollView key={i}>
                  <Banner
                    size={'small'}
                    title={vc.type || ''}
                    subTitle={vc.iss}
                    avatar={avatar1}
                    backgroundImage={bannerImage}
                  />
                  {
                    <ClaimExplore
                      claim={vc.claim}
                      jwt={'jwt.jwt.jwt'}
                      qrText={'Present for scanning'}
                      // @ts-ignore - Need to fix these
                      revoked={vc.revoked}
                      // @ts-ignore
                      exp={vc.exp}
                    />
                  }
                </ScrollView>
              )
            })}
        </Swiper>
      )}
    </Modal>
  )
}

export default Credential
