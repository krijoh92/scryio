import React from 'react'
import {Form, Input} from 'antd'

const FormItem = Form.Item

const rules = {
  required: {required: true, message: 'This field is required'},
  email: {type: 'email', message: 'Must be a valdi email address'},
}

class NewUserForm extends React.Component {
  render() {
    const {
      form: {getFieldDecorator},
    } = this.props
    return (
      <Form>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [rules.required],
          })(<Input placeholder="Username" autoComplete="username" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('email', {
            rules: [rules.required, rules.email],
          })(<Input placeholder="Email" autoComplete="email" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [rules.required],
          })(
            <Input
              placeholder="Email"
              type="password"
              autoComplete="current-password"
            />
          )}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(NewUserForm)
