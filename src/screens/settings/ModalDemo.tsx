import * as React from 'react'
import { Container, Modal, Text, Constants } from '@kancha/kancha-ui'
import { NavigationScreenProps } from 'react-navigation'
import { Colors } from '../../theme'

interface Props extends NavigationScreenProps {}

const ModalDemoScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <Modal dismiss={() => navigation.goBack()} scrollEnabled>
      <Container padding>
        <Container marginBottom>
          <Text type={Constants.TextTypes.H3}>Modal Demo</Text>
        </Container>
        <Container
          h={80}
          backgroundColor={Colors.LIGHTEST_GREY}
          br={10}
          marginBottom={10}
        />
        <Container
          h={80}
          backgroundColor={Colors.LIGHTEST_GREY}
          br={10}
          marginBottom={10}
        />
        <Container
          h={80}
          backgroundColor={Colors.LIGHTEST_GREY}
          br={10}
          marginBottom={10}
        />
        <Container
          h={80}
          backgroundColor={Colors.LIGHTEST_GREY}
          br={10}
          marginBottom={10}
        />
        <Container
          h={80}
          backgroundColor={Colors.LIGHTEST_GREY}
          br={10}
          marginBottom={10}
        />
        <Container
          h={80}
          backgroundColor={Colors.LIGHTEST_GREY}
          br={10}
          marginBottom={10}
        />
        <Container
          h={80}
          backgroundColor={Colors.LIGHTEST_GREY}
          br={10}
          marginBottom={10}
        />
        <Container
          h={80}
          backgroundColor={Colors.LIGHTEST_GREY}
          br={10}
          marginBottom={10}
        />
        <Container
          h={80}
          backgroundColor={Colors.LIGHTEST_GREY}
          br={10}
          marginBottom={10}
        />
      </Container>
    </Modal>
  )
}

export default ModalDemoScreen
