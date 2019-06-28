export const isValidMessage = (message: any) => {
  if (message.type && message.iss && message.iat) {
    return true
  } else {
    return false
  }
}

export const isValidVerifiableClaim = (vc: any) => {
  if (vc.claim && vc.iss && vc.sub && vc.iat) {
    return true
  } else {
    return false
  }
}
