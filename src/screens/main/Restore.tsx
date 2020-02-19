/**
 *
 */
import React, { useState } from 'react'
import { TextInput } from 'react-native'
import { Container, Text, Screen, Constants, Button } from '@kancha/kancha-ui'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { Colors } from '../../theme'
import { useMutation } from '@apollo/react-hooks'
import { IMPORT_IDENTITY } from '../../lib/graphql/queries'

const Restore: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  const [seed, setSeed] = useState('')
  const [errorState, setError] = useState(false)
  const [importSeed] = useMutation(IMPORT_IDENTITY, {
    onCompleted(resp) {
      if (resp.importIdentity && resp.importIdentity.did) {
        navigation.navigate('CreatingWallet', { import: true })
      }
    },
    onError(err) {
      if (err) {
        setError(true)
      }
    },
  })

  return (
    <Screen
      safeAreaBottom
      safeAreaBottomBackground={Colors.WHITE}
      scrollEnabled
      background={'primary'}
    >
      <Container padding>
        <Container marginTop={30} alignItems={'center'}>
          <Text type={Constants.TextTypes.H2} bold>
            Import seed
          </Text>
        </Container>
        <Container marginTop={30}>
          <TextInput
            onFocus={() => setError(false)}
            autoCapitalize={'none'}
            autoCompleteType={'off'}
            autoCorrect={false}
            numberOfLines={10}
            multiline
            placeholder={'Enter your seed phrase'}
            style={{
              height: 100,
              fontSize: 16,
              padding: 10,
              borderWidth: 1,
              borderColor: errorState ? Colors.WARN : Colors.MEDIUM_GREY,
              borderRadius: 5,
            }}
            onChangeText={setSeed}
          />
        </Container>
        <Container paddingTop>
          {errorState && (
            <Text warn>
              Oops...That looks like an invalid seed. Please check your seed and
              try again..
            </Text>
          )}
        </Container>
        <Container marginTop={30}>
          <Container>
            <Button
              disabled={!seed}
              fullWidth
              block={Constants.ButtonBlocks.Outlined}
              type={Constants.BrandOptions.Primary}
              buttonText={'Import'}
              onPress={() =>
                importSeed({
                  variables: {
                    type: 'rinkeby-ethr-did',
                    secret: seed,
                  },
                })
              }
            />
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}

export default Restore
