import * as React from 'react'
import {
  Container,
  Modal,
  Banner,
  ClaimExplore,
  Typings,
} from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'

// tslint:disable-next-line:no-var-requires
const avatar1 = require('../../assets/images/space-x-logo.jpg')

// tslint:disable-next-line:no-var-requires
const bannerImage = require('../../assets/images/space-x-banner.jpg')

interface Props extends NavigationStackScreenProps {}

const Credential: React.FC<Props> = ({ navigation }) => {
  const vc: Typings.VerifiableCredential = navigation.getParam('vc', null)

  return (
    <Modal scrollEnabled={true}>
      {vc && (
        <Container>
          <Banner
            size={'small'}
            title={vc.type || ''}
            subTitle={vc.iss}
            avatar={avatar1}
            backgroundImage={bannerImage}
          />
          <ClaimExplore claim={vc.claim} />
        </Container>
      )}
    </Modal>
  )
}

export default Credential
