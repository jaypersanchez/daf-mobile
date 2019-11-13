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
import { GET_MANAGED_IDENTITIES, SET_VIEWER } from '../../lib/graphql/queries'
import { useMutation } from '@apollo/react-hooks'

interface IdentitySelectModalProps {}

interface Identity {
  did: string
  shortId: string
  isSelected: boolean
  profileImage?: string
}

interface Resp {
  data: { managedIdentities: Identity[] }
  loading: boolean
  refetch: () => void
  client: any
}

const IdentitySelectModal: React.FC<IdentitySelectModalProps> = ({}) => {
  const [setViewer] = useMutation(SET_VIEWER)
  return (
    <Container>
      <Container marginBottom paddingTop>
        <Query query={GET_MANAGED_IDENTITIES}>
          {({ data }: Resp) => {
            return (
              <Section>
                {data &&
                  data.managedIdentities &&
                  data.managedIdentities.map((identity, index) => {
                    return (
                      <ListItem
                        key={identity.did}
                        hideForwardArrow
                        onPress={() => {
                          setViewer({
                            variables: {
                              did: identity.did,
                            },
                            refetchQueries: [{ query: GET_MANAGED_IDENTITIES }],
                          })
                        }}
                        subTitle={identity.shortId}
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
                        Identity sss {index + 1}
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
