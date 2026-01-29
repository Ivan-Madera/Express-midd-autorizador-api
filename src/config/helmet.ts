export const helmetTransportSecurity = {
  maxAge: 63072000,
  includeSubDomains: true,
  preload: true
}

export const helmetContentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    frameAncestors: ["'none'"]
  }
}
