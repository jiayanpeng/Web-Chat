// 顶部
import React, { useEffect, useRef, useState } from "react";
import { Input, Button, message, Avatar } from "antd";
import MainStyle from '../views/Main.module.css';
import { io } from "socket.io-client";
interface MsgValue {
  msg: string,
  type: number,
  userId: number
}

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

interface Props {
  id: number,
  userList: UserData[]
}

export default function TopHeader(props: Props) {

  const [messageApi, contextHolder] = message.useMessage()

  const { TextArea } = Input;

  const [msgList, setMsgList] = useState<Array<MsgValue>>([]) //聊天记录

  const [inputValue, setInputValue] = useState<string>('')

  const lastMsg = useRef<HTMLDivElement>(null)

  // 发送消息
  const socket = io('http://localhost:3001/')

  // 接收消息
  socket.on('recieveMsg', (data) => {
    let arr = [...msgList, data]
    setMsgList(arr)
  })

  const scrollToBottom = () => {
    const zone = lastMsg.current!;
    const height = zone.getBoundingClientRect().height;
    console.log(`设置前：显示区的高度为：${height}，内容区高度为：${zone.scrollHeight}，滚动条已滚动距离为：${zone.scrollTop}`);
    zone.scrollTop = zone.scrollHeight;
    console.log(`设置后：显示区的高度为：${height}，内容区高度为：${zone.scrollHeight}，滚动条已滚动距离为：${zone.scrollTop}`);
  }

  const sendMsg = () => {
    if (!inputValue) {
      messageApi.open({
        type: 'error',
        content: '不能发送空消息'
      })
    } else {
      let data = {
        msg: inputValue,
        type: 1,
        userId: props.id
      }
      console.log(data)
      // 发送消息
      socket.emit('sendMsg', data)
      setInputValue('')
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [msgList])

  return (
    <div style={{ height: '100%' }}>
      {contextHolder}
      <div className={MainStyle.title}>聊天群组</div>
      <div className={MainStyle.chatBox} ref={lastMsg}>
        <ul className={MainStyle.list} >
          {msgList.map((item, index) => {
            if (item.userId === props.id) {
              let user = props.userList.find(value => {
                return value.id === item.userId
              })
              return (
                <li style={{ display: 'flex', justifyContent: 'right' }} key={index}>
                  <div className={MainStyle.cardStyle} style={{ backgroundColor: 'green', margin: '10px 8px 0 0', padding: '5px 10px', color: '#fff' }}>
                    {item.msg}
                  </div>
                  <Avatar size={30} src={user?.headImg} />
                </li>
              )
            } else {
              let user = props.userList.find(value => {
                return value.id === item.userId
              })
              return (
                <li style={{ display: 'flex', justifyContent: 'left', position: 'relative' }} key={index}>
                  <Avatar size={30} src={user?.headImg} />
                  <span style={{ fontSize: " 12px ", position: 'absolute', left: '34px' }}>
                    {user?.name}
                  </span>
                  <div className={MainStyle.cardStyle} style={{ margin: '20px 0 0 8px', padding: '5px 10px' }}>
                    {item.msg}
                  </div>
                </li>
              )
            }
          })}
        </ul>
      </div>
      <div style={{ position: 'relative', height: '26%' }}>
        <TextArea style={{ resize: 'none' }} bordered={false} rows={4} value={inputValue} onChange={(e) => {
          setInputValue(e.target.value)
        }} />
        <Button type="primary" style={{ position: 'absolute', right: '20px', bottom: '10px' }} onClick={() => {
          sendMsg()
        }}>发送</Button>
      </div>
    </div>
  )
}
