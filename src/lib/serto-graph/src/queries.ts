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
  mutation newMessage($json: String!) {
    newMessage(json: $json) {
      hash
    }
  }
`

export const findMessages = gql`
  query FindMessages($iss: ID, $sub: ID) {
    messages(iss: $iss, sub: $sub) @client {
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
