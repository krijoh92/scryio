const EnforceSSL = ({children}) => {
  const isLocalHostOrTest = hostname =>
    !!(
      hostname === 'localhost' ||
      hostname === 'webapp' ||
      hostname === '[::1]' ||
      hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    )

  if (
    typeof window !== 'undefined' &&
    window.location &&
    window.location.protocol === 'http:' &&
    !isLocalHostOrTest(window.location.hostname)
  ) {
    window.location.href = window.location.href.replace(/^http(?!s)/, 'https')
  }

  return children
}

export default EnforceSSL
