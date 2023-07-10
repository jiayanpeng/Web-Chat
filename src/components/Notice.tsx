import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { List, Avatar, Button } from 'antd';
import setAvatar from '../utils/SetAvatar';
import { delNotice } from '../store/getNoticeSlice';
import request from '../api/request';
import { Socket } from 'socket.io-client';
// import { setNotice } from '../store/getNoticeSlice';

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

interface Props {
  socket: React.MutableRefObject<Socket<any, any>>
}

export default function Notice(props: Props) {

  const { socket } = props

  const setNotice: UserData[] = useSelector((state: any) => state.getNotice.value)

  const dispatch = useDispatch()

  const token: string = localStorage.getItem('token') as ''

  const handleNotice = (data: UserData, value: number) => {
    let userData = JSON.parse(token)
    console.log(value)
    let handleData = {
      userId: data.id,
      friendId: userData.id,
      handletype: value
    }
    request({
      url: '/handle-notice',
      method: 'post',
      data: handleData
    }).catch(error => {
      console.log(error)
    }).then((res: any) => {
      console.log(res.data)
    })
    dispatch(delNotice(data))
    if (value === 0) {
      socket.current.emit('handleNotice', handleData)
    } else {
      console.log('拒绝申请')
    }
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={setNotice}
      size='small'
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={<div dangerouslySetInnerHTML={{ __html: setAvatar(item.headImg) }} />} />}
            title={item.name}
            description={'Apply to add you as a friend'}
          />
          <Button size='small' type="primary" ghost onClick={() => {
            handleNotice(item, 0)
          }}>Yes</Button>
          <Button size='small' style={{ marginLeft: '10px' }} type="primary" danger ghost onClick={() => {
            handleNotice(item, 1)
          }}>No</Button>
        </List.Item>
      )}
    />
  )
}
