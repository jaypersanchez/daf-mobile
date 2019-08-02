import gql from 'graphql-tag'

export const GET_MY_IDENTITIES = gql`
  query GetMyIdentities($dids: [ID!]) {
    dids @client @export(as: "dids")
    identities(dids: $dids) {
      did
      shortId
    }
  }
`

export const getAllIdentities = gql`
  query GetAllIdentities {
    identities {
      did
      shortId
      firstName
      lastName
      profileImage
    }
  }
`

export const newMessage = gql`
  mutation newMessage($message: MessageInput!) {
    newMessage(message: $message) {
      hash
    }
  }
`

export const findMessages = gql`
  query FindMessages($iss: ID, $sub: ID) {
    messages(iss: $iss, sub: $sub) {
      iss {
        did
        shortId
        firstName
        lastName
        profileImage
      }
      type
      hash
      time
      vc {
        hash
        parentHash
        iss {
          did
          shortId
          firstName
          lastName
          profileImage
        }
        sub {
          did
          shortId
          firstName
          lastName
          profileImage
        }
        raw
        nbf
        fields {
          type
          value
          isObj
        }
      }
    }
  }
`
