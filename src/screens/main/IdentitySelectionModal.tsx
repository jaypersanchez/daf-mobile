import * as React from 'react'
import {
  Container,
  Modal,
  Text,
  ListItem,
  Avatar,
  Section,
  Constants,
  Button,
} from '@kancha/kancha-ui'
import { NavigationScreenProps } from 'react-navigation'

interface IdentitySelectModalProps extends NavigationScreenProps {}

const IdentitySelectModal: React.FC<IdentitySelectModalProps> = ({
  navigation,
}) => {
  return (
    <Modal scrollEnabled dismiss={() => navigation.goBack()}>
      <Container>
        <Container marginBottom paddingTop>
          <Section>
            <ListItem
              subTitle={'Subtitle'}
              iconLeft={
                <Avatar
                  address={'0xefghdjsjdj'}
                  type={'circle'}
                  gravatarType={'robohash'}
                />
              }
            >
              Identity 1
            </ListItem>
            <ListItem
              subTitle={'Subtitle'}
              iconLeft={
                <Avatar
                  address={'0xefghdjsjdjss'}
                  type={'circle'}
                  gravatarType={'robohash'}
                />
              }
            >
              Identity 2
            </ListItem>
            <ListItem
              subTitle={'Subtitle'}
              iconLeft={
                <Avatar
                  address={'0xefghdssjsjdj'}
                  type={'circle'}
                  gravatarType={'robohash'}
                />
              }
              last
            >
              Identity 3
            </ListItem>
          </Section>
          <Container padding alignItems={'center'}>
            <Container w={300} marginBottom={10}>
              <Button
                fullWidth
                buttonText={'Create Identity'}
                type={Constants.BrandOptions.Primary}
                block={Constants.ButtonBlocks.Filled}
                onPress={() => ''}
              />
            </Container>
            <Container w={300}>
              <Button
                fullWidth
                buttonText={'Import Identity'}
                type={Constants.BrandOptions.Primary}
                block={Constants.ButtonBlocks.Clear}
                onPress={() => ''}
              />
            </Container>
          </Container>
        </Container>
      </Container>
    </Modal>
  )
}

export default IdentitySelectModal
