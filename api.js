module.exports = function (req, res) {
  let url = req.originalUrl.split('?')[0]
  console.log(url)
  switch (url) {
    case '/auth/login': return login(req, res)
    case '/auth/refresh': return refresh(req, res)
    case '/action': return action(req, res)
  }
  res.send('ok')
}

function login (req, res) {
  let now = new Date()
  let expires = new Date(now.setSeconds(now.getSeconds() + 10))
  res.cookie('app-creds', `user=${req.body.username}`, {
    domain: 'webapp.com',
    expires: expires
  })
  let refreshExpires = new Date(now.setSeconds(now.getSeconds() + 60 * 60 * 24))
  res.cookie('app-creds-refresh', `user=${req.body.username}}`, {
    domain: 'webapp.com',
    path: '/auth/refresh',
    expires: refreshExpires
  })
  res.send('ok login')
}

function refresh (req, res) {
  console.log('>>>', req.cookies)
  let refreshCreds = req.cookies['app-creds-refresh']
  if(refreshCreds) {
    let now = new Date()
    let expires = new Date(now.setSeconds(now.getSeconds() + 10))
    res.cookie('app-creds', `user=shouldbesomethignmore`, {
      domain: 'webapp.com',
      expires: expires
    })
    res.send('ok login')
  } else {
    console.log("Refresh BAD!")
    res.status(401)
    res.send('UNAUTHORIZED')
  }

}

function action (req, res) {
  let creds = req.cookies['app-creds']
  if(creds) {
    console.log("GOOD!")
    res.send('ok action')
  } else {
    console.log("BAD!")
    res.status(401)
    res.send('UNAUTHORIZED')
  }
}