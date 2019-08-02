export const isValidMessage = (message: any) => {
  if (message.type && message.iss && message.nbf) {
    return true
  } else {
    return false
  }
}

export const isValidVerifiableClaim = (vc: any) => {
  if (vc.vc && vc.vc.credentialSubject && vc.iss && vc.sub && vc.nbf) {
    return true
  } else {
    return false
  }
}
