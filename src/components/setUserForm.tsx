import React from 'react';
import { Button, Form, Input, Avatar, FormInstance } from 'antd';
import { EditOutlined } from '@ant-design/icons'
import setAvatar from '../utils/SetAvatar';

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

interface Props {
  form: FormInstance<any>,
  initialValues: UserData
}

export default function SetUserForm(props: Props) {
  const { form, initialValues } = props

  return (
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Avatar"
        valuePropName="headImg"
        rules={[{ required: true, message: 'Please input your Avatar!' }]}
      >
        {/* <Input /> */}
        <div style={{
          position: 'relative'
        }}>
          <Avatar size={128} src={<div dangerouslySetInnerHTML={{ __html: setAvatar(initialValues.headImg) }} />} />
          <Button icon={<EditOutlined />} type="primary" style={{
            position: "absolute",
            bottom: '0',
            left: '95px'
          }} />
        </div>
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  )
}