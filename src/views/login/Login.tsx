import React, { useEffect } from "react";
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import LoginStyle from "./Login.module.css"
import request from "../../api/request";


export default function Login() {

  interface User {
    username: string,
    password: string
  }

  const [messageApi, contextHolder] = message.useMessage()

  const navigate = useNavigate()

  useEffect(() => {
    let token: string = localStorage.getItem('token') as ''
    if (!token) {
      messageApi.open({
        type: 'error',
        content: 'No login'
      })
    } else {
      navigate('/')
    }
  }, [messageApi, navigate])

  const onFinish = (values: User) => {
    let data = JSON.stringify(values)
    console.log(data)
    request({
      url: 'http://localhost:3001/login',
      method: 'post',
      data: data
    }).catch(error => {
      console.log(error)
    }).then((res: any) => {
      console.log(res.data)
      if (res.data.status === 0) {
        let userData = res.data.data
        let token = JSON.stringify(userData)
        console.log(token)
        localStorage.setItem('token', token)
        navigate('/')
        console.log('登陆成功')
      } else {
        console.log('登陆失败')
        messageApi.open({
          type: 'error',
          content: res.data.msg
        })
      }
    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={LoginStyle.box}>
      {contextHolder}
      <div className={LoginStyle.fromBox}>
        <h1>Login</h1>
        <Form
          name="basic"
          style={{ maxWidth: 400, margin: 'auto' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username cannot be empty!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password cannot be empty!' }]}
          >
            <Input.Password placeholder="Password" autoComplete="off" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
        <span>Don't have an account ? <Link to="/register">Register</Link></span>
      </div>
    </div>
  )
}