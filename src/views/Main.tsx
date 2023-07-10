/* 
  Copyright 2023 jiayanpeng. All Rights Reserved. Distributed under MIT license. 
  See file LICENSE for detail or copy at https://github.com/jiayanpeng/Web-Chat/blob/main/LICENSE
*/
import React, { useEffect, useState, useRef } from "react";
import Function from "../components/Function";
import ChatArea from "../components/ChatArea";
import UserList from "../components/UserList";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { message, Card, Button } from 'antd';
import MainStyle from './Main.module.css';
import request from "../api/request";
import { useDispatch } from "react-redux";
import { setNotice } from "../store/getNoticeSlice"
import { setGroupInfo } from "../store/toGroupSlice";
import { setOnlineUsers } from "../store/getOnlinUserSlice";
import { setUserInfo } from "../store/toUserSlice";
import { emptyMessageList } from "../store/getMessageListSlice";

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

export default function Main() {

  const dispatch = useDispatch()

  let token: string = localStorage.getItem('token') as ''

  const navigate = useNavigate()

  const [userData, setUserData] = useState<UserData>({ id: 0, username: '', password: '', name: '', headImg: '' }) //当前登陆的用户数据

  const [messageApi, contextHolder] = message.useMessage()

  const [onlineUser, setOnlineUser] = useState<Array<UserData>>([]) //在线的用户列表

  const [userList, setUserList] = useState<Array<UserData>>([])

  const socket = useRef(io('http://localhost:3001/'))
  // console.log(socket.current.id)

  const sockets = io('http://localhost:3001/') //window.onbeforeunload无法使用useRef

  // 用户退出
  window.onbeforeunload = () => {
    // socket.current.emit('disconnection', userData)
    sockets.emit('disconnection', userData)
    // console.log(userData.name + '页面关闭了')
    return '退出了'
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      // 获取用户列表 获取完整的用户列表是用于渲染聊天记录里的头像和昵称
      request.get('/user').catch(error => {
        console.log(error)
      }).then((res: any) => {
        // console.log(res.data) //输出获取的所有用户列表 
        setUserList(res.data)
      })

      let user = JSON.parse(token)
      let id = user.id
      // console.log(id)
      request.get(`/notices?id=${id}`).catch(error => {
        console.log(error)
      }).then((res: any) => {
        // console.log(res.data)
        dispatch(setNotice(res.data))
      })
    }

    console.log('Copyright 2023 jiayanpeng. All Rights Reserved. Distributed under MIT license.')
    console.log('See file LICENSE for detail or copy at https://github.com/jiayanpeng/Web-Chat/blob/main/LICENSE')
  }, [token, dispatch, navigate])


  //socket 消息处理
  useEffect(() => {
    if (!token) {
      console.log('没有登陆')
      navigate('/login')
    } else {
      // 告诉服务器谁连接了
      socket.current.on("connect", () => {
        // console.log(socket.connected); // 输出结果为true表示连接正常
        socket.current.emit('login', token)
      })
    }
    // console.log(token)
    let data = JSON.parse(token)
    // 新用户加入广播
    socket.current.on('addUser', (data, list) => {
      // console.log(data) //输出新加入的用户信息
      // console.log(list) //输出加入后的新的在线列表
      setOnlineUser(list)
      dispatch(setOnlineUsers(list))
      messageApi.open({
        type: 'success',
        content: data.name + '加入链接'
      })
    })

    //socket 监听在线通知
    socket.current.on('getNotice', data => {
      console.log(1111)
      console.log(data)
      dispatch(setNotice(data))
    })

    // 其他用户退出广播
    socket.current.on('outlogin', (data, list) => {
      // console.log(data) //输出新的在线用户列表
      setOnlineUser(list)
      dispatch(setOnlineUsers(list))
      messageApi.open({
        type: 'error',
        content: data.name + '离开链接'
      })
    })
    setUserData(data)

    return () => {
      // socket.current.off('outlogin')
    }
  }, [messageApi, token, navigate, dispatch])

  const Logout = () => {
    sockets.emit('disconnection', userData)
    dispatch(emptyMessageList())
    dispatch(setUserInfo({
      id: 0,
      name: '',
      type: 0
    }))
    dispatch(setGroupInfo({
      id: 0,
      name: '',
      member: []
    }))
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className={MainStyle.box}>
      {contextHolder}
      <Card bordered={false} className={MainStyle.card} bodyStyle={{ display: 'flex', height: '100%' }}>
        <Card.Grid hoverable={false} style={{ width: '8%', padding: '10px' }}>
          <Function userData={userData} socket={socket} />
        </Card.Grid>
        <Card.Grid hoverable={false} style={{ width: '22%', padding: '10px 0' }}>
          <UserList onlineUserList={onlineUser} socket={socket} />
        </Card.Grid>
        <Card.Grid hoverable={false} style={{ width: '70%', padding: '10px' }}>
          <ChatArea id={userData.id} userList={userList} socket={socket} />
        </Card.Grid>
      </Card>
      <Button danger className={MainStyle.logout} onClick={() => { Logout() }}>Logout</Button>
    </div>
  )
}
