import * as React from 'react'
import {
  Container,
  ListItem,
  Avatar,
  Section,
  Constants,
  Button,
} from '@kancha/kancha-ui'
import { Query } from 'react-apollo'
import { getDidsQuery, Did } from '../../lib/Signer'

interface IdentitySelectModalProps {}

interface Resp {
  data: { dids: Did[] }
  loading: boolean
  refetch: () => void
  client: any
}

const IdentitySelectModal: React.FC<IdentitySelectModalProps> = ({}) => {
  return (
    <Container>
      <Container marginBottom paddingTop>
        <Query query={getDidsQuery}>
          {({ data, client }: Resp) => {
            return (
              <Section>
                {data &&
                  data.dids &&
                  data.dids.map((identity, index) => {
                    return (
                      <ListItem
                        key={identity.did}
                        hideForwardArrow
                        onPress={() => {
                          client.writeData({
                            data: { selectedDid: identity.did },
                          })
                          client.reFetchObservableQueries()
                        }}
                        subTitle={identity.did.substring(0, 25) + '...'}
                        selected={identity.isSelected}
                        iconLeft={
                          <Avatar
                            border={!identity.isSelected}
                            address={identity.did}
                            type={'circle'}
                            gravatarType={'robohash'}
                          />
                        }
                      >
                        Identity {index + 1}
                      </ListItem>
                    )
                  })}
              </Section>
            )
          }}
        </Query>

        {/* <Container padding alignItems={'center'}>
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
        </Container> */}
      </Container>
    </Container>
  )
}

export default IdentitySelectModal
