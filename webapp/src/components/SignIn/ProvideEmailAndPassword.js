import * as React from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import {Button, Form, Input, Icon} from 'antd'
import {UserContext} from 'components/shared'
import {obtainRefreshToken} from 'lib/auth/index'

const FormItem = Form.Item
const PrefixIcon = styled(Icon)`
  color: rgba(0, 0, 0, 0.25);
`
const SubmitButton = styled(Button)`
  &.ant-btn {
    width: 100%;
  }
`

class ProvideEmailAndPassword extends React.Component {
  state = {
    submitting: false,
    error: null,
  }

  onSubmit = (e, signIn) => {
    e.preventDefault()
    const {form} = this.props
    form.validateFields(async (err, {email, password}) => {
      if (!err) {
        try {
          this.setState(() => ({submitting: true, error: null}))
          const token = await obtainRefreshToken(email, password)
          signIn(token)
          this.props.history.push({pathname: '/'})
        } catch (e) {
          console.log(e)
          this.setState(() => ({
            submitting: false,
            error: 'Something went wrong',
          }))
        }
      }
    })
  }

  render() {
    const {submitting, error} = this.state
    const {
      form: {getFieldDecorator},
    } = this.props

    return (
      <UserContext.Consumer>
        {({user, signIn}) => {
          return (
            <Form onSubmit={e => this.onSubmit(e, signIn)}>
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,

                      type: 'email',
                      message: 'Must be a valid email address',
                    },
                  ],
                })(
                  <Input
                    autoFocus
                    prefix={<PrefixIcon type="user" />}
                    placeholder="Email"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    {required: true, message: 'Please input your password'},
                  ],
                })(
                  <Input
                    prefix={<PrefixIcon type="lock" />}
                    type="password"
                    placeholder="Password"
                  />
                )}
              </FormItem>
              <FormItem>
                <SubmitButton
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                >
                  Sign in
                </SubmitButton>
                Or <Link to="/signup">register now!</Link>
              </FormItem>
            </Form>
          )
        }}
      </UserContext.Consumer>
    )
  }
}

export default Form.create()(ProvideEmailAndPassword)
