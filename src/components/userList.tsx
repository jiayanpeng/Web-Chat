// 消息和好友列表
import React, { useEffect, useState } from "react";
import { Avatar, List } from 'antd';
import MainStyle from '../views/Main.module.css';
import { useSelector, useDispatch } from "react-redux";
import setAvatar from "../utils/SetAvatar";
import request from "../api/request";
import { setUserInfo } from "../store/toUserSlice";
import { setGroupInfo } from "../store/toGroupSlice";
import { Socket } from "socket.io-client";
import { setMessageData } from "../store/getMessageDataSlice";
// import { setMessageList } from "../store/getMessageListSlice";

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string,
  unread?: []
}

interface Groups {
  id: number,
  headImg: string,
  name: string,
  member: number[]
}

interface Props {
  onlineUserList: UserData[],
  socket: React.MutableRefObject<Socket<any, any>>
}

export default function UserList(props: Props) {

  const userInfo = useSelector((state: any) => state.toUser)
  // console.log(userInfo)

  const groupInfo = useSelector((state: any) => state.toGroup)
  // console.log(groupInfo)

  const messageList: any[] = useSelector((state: any) => state.getMessageList.value)
  // console.log(messageList)

  const { onlineUserList, socket } = props

  const dispatch = useDispatch()

  const activeRouter = useSelector((state: any) => state.activeRouter.value)

  const [list, setList] = useState<Array<UserData>>([])

  const [friendList, setFriendList] = useState<Array<UserData>>([])

  const [groupsList, setGroupsList] = useState<Groups[]>([])

  const token: string = localStorage.getItem('token') as ''

  const [tabs, setTabs] = useState<number>(0)

  useEffect(() => {
    let userdata = JSON.parse(token)
    request.get(`/groups?id=${userdata.id}`).catch(error => {
      console.log(error)
    }).then((res: any) => {
      // console.log('群列表')
      // console.log(res.data)
      setGroupsList(res.data)
    })

    request.get(`/friend?id=${userdata.id}`).catch(error => {
      console.log(error)
    }).then((res: any) => {
      // console.log(res.data)
      setFriendList(res.data)
    })
  }, [token, dispatch])

  useEffect(() => {
    setTabs(0)
    if (activeRouter === 'Message') {
      let list: UserData[] = messageList.map(item => {
        item = friendList.find(value => value.id === item)
        return item!
      })
      setList(list)
    } else if (activeRouter === 'Friends') {
      setList(friendList)
    }
  }, [activeRouter, friendList, messageList])

  useEffect(() => {
    let userdata = JSON.parse(token)
    let sockets = socket.current
    sockets.on('newFriend', (data: any) => {
      console.log(data)
      setFriendList([...friendList, data])
    })
    sockets.on('newFriend-newMessage', (data: any) => {
      console.log(data.id, data.name)
      setFriendList([...friendList, data])
      let newMessage = {
        msg: 'We are already friends',
        type: 1,
        userId: userdata.id,
        friendId: data.id
      }
      sockets.emit('sendMsg', newMessage)
      // 把自己的消息push到所有消息里
      dispatch(setMessageData(newMessage))
      // 把对方push到消息列表里
      // dispatch(setMessageList(data.id))
    })
    return () => {
      sockets.off('newFriend')
      sockets.off('newFriend-newMessage')
    }
  })

  // 这里有个比较重要的地方，在点击好友的时候要把当前groupInfo给设为初始值
  // 点击群聊的时候把当前userInfo给设为初始值
  // ChatArea组件通过判断userInfo和groupInfo的id来确定当时是私聊还是群聊以及一些ui显示
  // 如果没有清理掉userInfo的id或者groupInfo的id，那么在发送消息的时候会同时向id为userInfo.id的好友发送消息和id为groupInfo的群聊发送数据
  const toUser = (item: UserData, id: number) => {
    let online = onlineUserList.find((item) => {
      return item.id === id
    })
    let type = online ? 1 : 0
    // console.log(type)
    dispatch(setGroupInfo({
      id: 0,
      name: '',
      member: []
    }))
    dispatch(setUserInfo({
      id: item.id,
      name: item.name,
      type
    }))
  }

  const toGroup = (item: Groups) => {
    let data = {
      id: item.id,
      name: item.name,
      member: item.member
    }

    dispatch(setUserInfo({
      id: 0,
      name: '',
      type: 0
    }))
    dispatch(setGroupInfo(data))
  }

  // const changingOverTabs = (value: number) => {
  //   setTabs(value)
  // }

  return (
    <div className={MainStyle.userList}>
      <div className={MainStyle.title} style={{ margin: '0 10px' }}>{activeRouter} list</div>
      {tabs === 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item) => (
            <List.Item style={{ cursor: 'pointer', padding: '10px 10px', backgroundColor: item.id === userInfo.id ? 'rgba(22,119,255,0.1)' : '' }} onClick={() => {
              toUser(item, item.id)
            }} >
              <List.Item.Meta
                avatar={<Avatar src={<div dangerouslySetInnerHTML={{ __html: setAvatar(item.headImg) }} />} />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={groupsList}
          renderItem={(item) => (
            <List.Item style={{ cursor: 'pointer', padding: '10px 10px', backgroundColor: item.id === groupInfo.id ? 'rgba(22,119,255,0.1)' : '' }} onClick={() => {
              toGroup(item)
            }} >
              <List.Item.Meta
                avatar={<Avatar src={item.headImg} />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      )}
      {/* 好友列表底部选项卡，选择显示好友列表或群列表 */}
      {/* {activeRouter === 'Friends' && (
        <div className={MainStyle.userListTabs}>
          <div onClick={() => changingOverTabs(0)} className={tabs === 0 ? MainStyle.activeTabs : ''}>friends</div>
          <div onClick={() => changingOverTabs(1)} className={tabs === 1 ? MainStyle.activeTabs : ''}>groups</div>
        </div>
      )} */}
    </div>
  )
}