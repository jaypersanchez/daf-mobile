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
      rowId
      hash
      iat
      nbf
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
        jwt
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

export const findClaims = gql`
  query FindClaims($iss: ID, $sub: ID) {
    claims(iss: $iss, sub: $sub) {
      rowId
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
      jwt
      nbf
      fields {
        type
        value
        isObj
      }
    }
  }
`
