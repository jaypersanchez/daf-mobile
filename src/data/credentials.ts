import {
  startOfYesterday,
  getTime,
  endOfTomorrow,
  endOfYesterday,
} from 'date-fns'

export const sertoVerifiableCredential = {
  iss: 'Serto Identity Platform',
  sub: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
  type: 'Serto ID',
  iat: 1562769371,
  exp: getTime(endOfTomorrow()),
  revoked: false,
  claim: {
    'Serto ID': {
      name: 'Sarah Adamson',
      dateOfBirth: '22-01-75',
      country: 'USA',
      children: [
        {
          name: 'Bob',
          age: 4,
        },
        {
          name: 'Alice',
          age: 9,
        },
      ],
    },
  },
  vc: [],
}

export const bankVerifiableCredential = {
  iss: 'Deutsche Bank',
  sub: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
  type: 'Credit Worthy',
  iat: 1562769371,
  exp: getTime(endOfYesterday()),
  revoked: true,
  claim: {
    'Credit Worthy': {
      name: 'Alice Chainy',
      dateOfBirth: '22-01-75',
      country: 'China',
      approvedLimit: 30000000,
    },
  },
  vc: [],
}

export const galleryAdmission = {
  iss: 'Museum of Identity',
  sub: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74',
  type: 'Admit One',
  iat: 1562769371,
  exp: getTime(endOfTomorrow()),
  revoked: false,
  claim: {
    'Admit One': {
      addmission: 'One Person',
      access: 'Zone A - Zone F',
      type: 'Single Use',
    },
  },
  vc: [],
}
