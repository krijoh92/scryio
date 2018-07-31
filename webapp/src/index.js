import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {ApolloProvider} from 'react-apollo'
import {client} from 'lib/graphql'
import {
  BrowserSupport,
  EnforceSSL,
  User,
  SignIn,
  SignUp,
  PrivateRoute,
} from 'components'
import {UserContextProvider} from 'components/shared/UserContext'
import {LocaleProvider} from 'antd'
import locale from 'antd/lib/locale-provider/nb_NO'
import './css/index.css'

ReactDOM.render(
  <EnforceSSL>
    <BrowserSupport>
      <LocaleProvider locale={locale}>
        <ApolloProvider client={client}>
          <UserContextProvider>
            <Router>
              <Switch>
                <Route path="/login" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <PrivateRoute component={User} />
              </Switch>
            </Router>
          </UserContextProvider>
        </ApolloProvider>
      </LocaleProvider>
    </BrowserSupport>
  </EnforceSSL>,
  document.getElementById('root')
)
