// 顶部
import React, { useEffect, useRef, useState } from "react";
import { Input, Button, message, Avatar, InputRef, Modal } from "antd";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import MainStyle from '../views/Main.module.css';
import { io } from "socket.io-client";
import {
  SmileOutlined,
  PictureOutlined
} from '@ant-design/icons';
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
  userList: UserData[],
}


export default function TopHeader(props: Props) {

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
    setEmojiShow(false)
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

  const openImg = () => {
    // console.log('发送图片')
    lastImg.current!.input!.click()
    // console.log(lastImg.current!.input!.files)
  }

  const sendImg = (e: any) => {
    let file = e.target.files[0]
    console.log(file)
    let fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      let data = {
        msg: fileReader.result,
        type: 2,
        userId: props.id
      }
      socket.emit('sendMsg', data)
      setImgValue('')
      // console.log(fileReader.result)
    }
  }

  const openEmoji = () => {
    console.log('打开表情')
    setEmojiShow(true)
    if (emojiShow) {
      setEmojiShow(false)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [msgList])

  return (
    <div style={{ height: '100%' }}>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} maskClosable={true} closable={false}>
        <img style={{ width: '100%' }} src={currentImg} alt="" />
      </Modal>
      <Input type="file" style={{ display: 'none' }} ref={lastImg} value={imgValue} onChange={(e) => sendImg(e)} />
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
                  {item.type === 1 ? (
                    <div className={MainStyle.myCardStyle}>
                      {item.msg}
                    </div>) :
                    (
                      <div className={MainStyle.myImgBox} onClick={() => showModal(item.msg)}><img className={MainStyle.msgImg} src={item.msg} alt="" /></div>
                    )}
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
      </div>
      <div style={{ position: 'relative', height: '26%' }}>
        <div style={{ padding: '4px 11px 0 11px', position: 'relative' }}>
          {emojiShow && (
            <div style={{ position: 'absolute', bottom: '28px' }}>
              <Picker searchPosition='none' locale='zh' data={data} onEmojiSelect={(e: any) => {
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
        }}>发送</Button>
      </div>
    </div >
  )
}
