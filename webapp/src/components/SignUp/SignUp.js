import React from 'react'
import styled from 'styled-components'
import {Card} from 'antd'
import NewUserForm from './NewUserForm'

const Overlay = styled.div`
  background-color: #001529;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 18px;
`

const SignUp = () => (
  <Overlay>
    <Card title={<h2>Sign up</h2>} style={{width: 350}}>
      <NewUserForm />
    </Card>
  </Overlay>
)

export default SignUp
