import React from 'react'
import {Route} from 'react-router-dom'
import styled from 'styled-components'
import {Card} from 'antd'
import ProvideEmailAndPassword from './ProvideEmailAndPassword'

const LoginOverlay = styled.div`
  background-color: #001529;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 18px;
`

const SignIn = ({match}) => (
  <LoginOverlay>
    <Card title={<h2>Sign in</h2>} style={{width: 350}}>
      <Route exact path={match.url} component={ProvideEmailAndPassword} />
    </Card>
  </LoginOverlay>
)

export default SignIn
