import React, { useEffect, useState } from "react";
import Function from "../components/Function";
import ChatArea from "../components/chatArea";
import UserList from "../components/userList";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { message, Card } from 'antd';
import MainStyle from './Main.module.css';
import request from "../api/request";

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

export default function Main() {

  const socket = io('http://localhost:3001/')

  const navigate = useNavigate()

  const [userData, setUserData] = useState<UserData>({ id: 0, username: '', password: '', name: '', headImg: '' }) //当前登陆的用户数据

  const [messageApi, contextHolder] = message.useMessage()

  const [onlineUser, setOnlineUser] = useState<Array<UserData>>([]) //在线的用户列表

  const [userList, setUserList] = useState<Array<UserData>>([])

  // 用户退出
  window.onbeforeunload = () => {
    socket.emit('disconnection', userData)
    console.log('页面关闭了')
    return '退出了'
  }

  useEffect(() => {
    const socket = io('http://localhost:3001/')

    // 获取用户列表 获取完整的用户列表是用于渲染聊天记录里的头像和昵称
    request.get('/user').catch(error => {
      console.log(error)
    }).then((res: any) => {
      // console.log(res.data) //输出获取的所有用户列表 
      setUserList(res.data)
    })

    let token: string = localStorage.getItem('token') as ''

    let data = JSON.parse(token)

    setUserData(data)

    if (!token) {
      console.log('没有登陆')
      navigate('/login')
    } else {
      // 告诉服务器谁连接了
      socket.on("connect", () => {
        // console.log(socket.connected); // 输出结果为true表示连接正常
        socket.emit('login', token)
      })
    }
    // 新用户加入广播
    socket.on('addUser', (data, list) => {
      // console.log(data) //输出新加入的用户信息
      // console.log(list) //输出加入后的新的在线列表
      setOnlineUser(list)
      messageApi.open({
        type: 'success',
        content: data.name + '加入链接'
      })
    })

    // 其他用户退出广播
    socket.on('outlogin', (data, list) => {
      // console.log(list) //输出新的在线用户列表
      setOnlineUser(list)
      messageApi.open({
        type: 'error',
        content: data.name + '离开链接'
      })
    })

  }, [navigate, messageApi])

  return (
    <div className={MainStyle.box}>
      {contextHolder}
      <Card bordered={false} className={MainStyle.card} bodyStyle={{ display: 'flex', height: '100%' }}>
        <Card.Grid hoverable={false} style={{ width: '8%', padding: '10px' }}>
          <Function userData={userData} />
        </Card.Grid>
        <Card.Grid hoverable={false} style={{ width: '22%', padding: '10px' }}>
          <UserList userList={onlineUser} />
        </Card.Grid>
        <Card.Grid hoverable={false} style={{ width: '70%', padding: '10px' }}>
          <ChatArea id={userData.id} userList={userList} />
        </Card.Grid>
      </Card>
    </div>
  )
}
