// 顶部
import React, { useEffect, useRef, useState } from "react";
import { Input, Button, message, Avatar, InputRef, Modal, Tooltip } from "antd";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import MainStyle from '../views/Main.module.css';
import { Socket } from "socket.io-client";
import setAvatar from "../utils/SetAvatar";
import { useSelector, useDispatch } from "react-redux";
import { setMessageData } from "../store/getMessageDataSlice";
import { setMessageList } from "../store/getMessageListSlice";
import welcomeSvg from './img/Welcome.svg'
import onlinenImg from './img/online.png'
import offlineImg from './img/offline.png'
import {
  SmileOutlined,
  PictureOutlined
} from '@ant-design/icons';
interface MsgValue {
  msg: string,
  type: number,
  userId: number,
  friendId: number
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
  userList: UserData[],
  socket: React.MutableRefObject<Socket<any, any>>
}


export default function TopHeader(props: Props) {

  const { id, userList, socket } = props

  const userInfo = useSelector((state: any) => state.toUser) //The type of userInfo, where 0 is offline and 1 is online
  // console.log(userInfo)

  const groupInfo = useSelector((state: any) => state.toGroup)
  // console.log(groupInfo)

  const allMessageList: MsgValue[] = useSelector((state: any) => state.getMessageData.value) //所有自己发送的和别人发送给自己的消息
  // console.log(allMessageList)

  const dispatch = useDispatch()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage()

  const { TextArea } = Input;

  const [msgList, setMsgList] = useState<Array<MsgValue>>([]) //聊天记录

  const [inputValue, setInputValue] = useState<string>('')

  const [emojiShow, setEmojiShow] = useState<boolean>(false)

  const [imgValue, setImgValue] = useState<string>('')

  const [currentImg, setCurrentImg] = useState<string>('')

  const lastMsg = useRef<HTMLDivElement>(null)

  const lastImg = useRef<InputRef>(null)

  const showModal = (imgSrc: string) => {
    setCurrentImg(imgSrc)
    setIsModalOpen(true);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const scrollToBottom = () => {
    const zone = lastMsg.current!;
    // const height = zone.getBoundingClientRect().height;
    // console.log(`设置前：显示区的高度为：${height}，内容区高度为：${zone.scrollHeight}，滚动条已滚动距离为：${zone.scrollTop}`);
    zone.scrollTop = zone.scrollHeight;
    // console.log(`设置后：显示区的高度为：${height}，内容区高度为：${zone.scrollHeight}，滚动条已滚动距离为：${zone.scrollTop}`);
  }
  // 发送消息
  const sendMsg = () => {
    setEmojiShow(false)
    if (!inputValue) {
      messageApi.open({
        type: 'error',
        content: 'Cannot send empty message'
      })
    } else {
      if (userInfo.id !== 0) {
        let data = {
          msg: inputValue,
          type: 1,
          userId: id,
          friendId: userInfo.id
        }
        // 把自己的消息push到所有消息里
        dispatch(setMessageData(data))
        // 把对方push到消息列表里
        dispatch(setMessageList(userInfo.id))
        // setMsgList(allMessageList) 这个方法里会触发setInputValue这个useState,所以不需要再setMsgList()也会重新渲染
        // 直接在useEffect里面触发 setMsgList() 就好了
        socket.current.emit('sendMsg', data)
      } else {
        console.log('群聊发送群消息')
      }
      setInputValue('')
    }
  }

  const openImg = () => {
    // console.log('发送图片')
    lastImg.current!.input!.click()
    // console.log(lastImg.current!.input!.files)
  }

  // 发送图片
  const sendImg = (e: any) => {
    if (userInfo.id !== 0) {
      let file = e.target.files[0]
      console.log(file)
      let fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        let data = {
          msg: `${fileReader.result!}`,
          type: 2,
          userId: id,
          friendId: userInfo.id
        }
        dispatch(setMessageData(data))
        dispatch(setMessageList(userInfo.id))
        // setMsgList(allMessageList) 同发送消息
        socket.current.emit('sendMsg', data)
        setImgValue('')
      }
    } else {
      console.log('群聊发送群消息')
      setImgValue('')
    }
  }

  // 打开表情列表
  const openEmoji = () => {
    console.log('打开表情')
    setEmojiShow(true)
    if (emojiShow) {
      setEmojiShow(false)
    }
  }

  useEffect(() => {
    // const socket = io('http://localhost:3001/')
    const sockets = socket.current
    // 接收消息
    sockets.on('recieveMsg', (data: any) => {
      console.log(data)
      // let arr = [...msgList, data]
      dispatch(setMessageData(data))
      dispatch(setMessageList(data.userId))
      // console.log(arr)
      setMsgList(allMessageList)
    })

    scrollToBottom()

    return () => {
      sockets.off('recieveMsg')
    }

  }, [msgList, socket, dispatch, allMessageList])

  useEffect(() => {
    // 从所有的消息里面过滤出自己的和对方的消息
    const getCurrentMessageList = () => {
      let currentMsgList = allMessageList.filter(item => {
        return (item.userId === id && item.friendId === userInfo.id) || (item.userId === userInfo.id && item.friendId === id)
      })
      // console.log(allMessageList)
      // console.log(currentMsgList)
      return currentMsgList
    }
    // console.log(userInfo.name)
    setMsgList(getCurrentMessageList())
  }, [allMessageList, id, userInfo])

  return (
    <div style={{ height: '100%' }}>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} maskClosable={true} closable={false}>
        <img style={{ width: '100%' }} src={currentImg} alt="" />
      </Modal>
      <Input type="file" style={{ display: 'none' }} ref={lastImg} value={imgValue} onChange={(e) => sendImg(e)} />
      {contextHolder}
      <div className={MainStyle.title}>
        {/* Chat Box */}
        {
          // userInfo是当前点击的好友(friend)的信息
          // groupInfo是当前点击的群聊(group)的信息
          (userInfo.id === 0 && groupInfo.id === 0) ? 'Welcome' : (
            <div className={MainStyle.chatBoxTop}>
              {userInfo.id !== 0 ? userInfo.name : groupInfo.name}
              <Tooltip placement="bottomLeft" title={userInfo.type === 0 ? 'The other party is offline' : 'The other party is online'} >
                {/* 好友的在线状态，只有userInfo的id不为零时显示，userInfo的id为零说明当前的窗口时欢迎页面或者群聊 */}
                {userInfo.id !== 0 && (
                  <div className={MainStyle.onlineType}>
                    <img src={userInfo.type === 0 ? offlineImg : onlinenImg} alt="" />
                  </div>
                )}
              </Tooltip>
            </div>
          )
        }
      </div>
      {
        (userInfo.id === 0 && groupInfo.id === 0) && (
          <div className={MainStyle.welcomeSvg}>
            <img src={welcomeSvg} alt="" style={{ width: '100%' }} />
          </div>
        )
      }
      <div className={MainStyle.chatBox} ref={lastMsg}>
        {
          userInfo.id !== 0 && (
            <ul className={MainStyle.list} >
              {msgList.map((item, index) => {
                if (item.userId === id) {
                  let user = userList.find(value => {
                    return value.id === item.userId
                  })
                  return (
                    <li style={{ display: 'flex', justifyContent: 'right' }} key={index}>
                      {item.type === 1 ? (
                        <div className={MainStyle.myCardStyle}>
                          {item.msg}
                        </div>) :
                        (
                          <div className={MainStyle.myImgBox} onClick={() => showModal(item.msg)}><img className={MainStyle.msgImg} src={item.msg} alt="" /></div>
                        )}
                      <Avatar size={30} src={<div dangerouslySetInnerHTML={{ __html: setAvatar(user!.headImg) }} />} />
                    </li>
                  )
                } else {
                  let user = userList.find(value => {
                    return value.id === item.userId
                  })
                  return (
                    <li style={{ display: 'flex', justifyContent: 'left', position: 'relative' }} key={index}>
                      <Avatar size={30} src={<div dangerouslySetInnerHTML={{ __html: setAvatar(user!.headImg) }} />} />
                      <span style={{ fontSize: " 12px ", position: 'absolute', left: '34px' }}>
                        {user?.name}
                      </span>
                      {item.type === 1 ? (
                        <div className={MainStyle.otherCardStyle} >
                          {item.msg}
                        </div>) :
                        (
                          <div className={MainStyle.otherImgBox} onClick={() => showModal(item.msg)}><img className={MainStyle.msgImg} src={item.msg} alt="" /></div>
                        )}
                    </li>
                  )
                }
              })}
            </ul>
          )
        }
      </div>
      {
        (userInfo.id !== 0 || groupInfo.id !== 0) && (
          <div className={MainStyle.chatBoxInput}>
            <div style={{ padding: '4px 11px 0 11px', position: 'relative' }}>
              {emojiShow && (
                <div style={{ position: 'absolute', bottom: '28px' }}>
                  <Picker searchPosition='none' data={data} onEmojiSelect={(e: any) => {
                    setInputValue(inputValue + e.native)
                  }} />
                </div>
              )}
              <SmileOutlined className={MainStyle.iconStyle} onClick={() => { openEmoji() }} />
              <PictureOutlined className={MainStyle.iconStyle} onClick={() => {
                openImg()
              }} />
            </div>
            <TextArea style={{ resize: 'none' }} bordered={false} rows={4} value={inputValue} onChange={(e) => {
              setInputValue(e.target.value)
            }} />
            <Button type="primary" style={{ position: 'absolute', right: '20px', bottom: '10px' }} onClick={() => {
              sendMsg()
            }}>Send</Button>
          </div>
        )
      }
    </div >
  )
}

export function MessageList() {

}
