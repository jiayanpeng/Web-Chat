import React, { useEffect } from "react";
import { Button, Form, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import LoginStyle from "./Login.module.css"
import { message } from 'antd'
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
        content: '没有登陆'
      })
    }
  }, [messageApi])

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
        <h1>登陆</h1>
        <Form
          name="basic"
          style={{ maxWidth: 400, margin: 'auto' }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '账号不能为空!' }]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '密码不能为空!' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              登陆
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}