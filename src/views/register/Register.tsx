import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd';
import RegisterStyle from './Register.module.css'

export default function Register() {

  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  const onFinish = (values: any) => {
    let { name, username, password, Confirmpassword } = values
    if (Confirmpassword !== password) {
      messageApi.open({
        type: 'error',
        content: 'Confirm password does not match password'
      })
    } else {
      let data = {
        name,
        username,
        password
      }
      console.log(data)
      navigate('/avatar', { state: data })
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={RegisterStyle.box}>
      {contextHolder}
      <div className={RegisterStyle.fromBox}>
        <h1>Register</h1>
        <Form
          name="basic"
          style={{ maxWidth: 400, margin: 'auto' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >

          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Name cannot be empty!' }, { type: 'string', min: 1 }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username cannot be empty!' }, { type: 'string', min: 6 }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="e-mail"
            rules={[{ required: true, message: 'E-mail cannot be empty!' }, { type: 'email' }]}
          >
            <Input placeholder="E-mail" />
          </Form.Item>


          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password cannot be empty!' }, { type: 'string', min: 6 }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="Confirmpassword"
            rules={[{ required: true, message: 'Confirm Password cannot be empty!' }, { type: 'string', min: 6 }]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
        <span>Have an account ? <Link to="/login">Login</Link></span>
      </div>
    </div>
  )
}
