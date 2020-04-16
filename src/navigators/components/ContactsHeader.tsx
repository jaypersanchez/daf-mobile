import React from 'react'
import { ScrollView } from 'react-native'
import { Container, Typings, Connection } from '@kancha/kancha-ui'
import { Colors } from '../../theme'

interface Identity extends Typings.Identity {
  isSelected: boolean
  isManaged: boolean
  profileImage?: string
}

interface ContactsHeaderProps {
  identities: Identity[]
  viewProfile: (did: string) => void
}

const ContactsHeader: React.FC<ContactsHeaderProps> = ({
  identities,
  viewProfile,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: Colors.WHITE, marginBottom: 1 }}
    >
      <Container flexDirection={'row'}>
        {identities &&
          identities
            .sort(
              (id1: Identity, id2: Identity) =>
                (id2.isSelected ? 1 : 0) - (id1.isSelected ? 1 : 0),
            )
            .map((identity: Typings.Identity & { isManaged: boolean }) => {
              return (
                <Connection
                  key={identity.did}
                  onPress={() => viewProfile(identity.did)}
                  shortId={identity.shortId}
                  did={identity.did}
                  profileImage={identity.profileImage}
                  isManaged={identity.isManaged}
                />
              )
            })}
      </Container>
    </ScrollView>
  )
}

export default ContactsHeader
