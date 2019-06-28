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

export const newMessage = gql`
  mutation newMessage($jwt: String!) {
    newMessage(jwt: $jwt) {
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
      iat
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
        iat
        fields {
          type
          value
          isObj
        }
      }
    }
  }
`
