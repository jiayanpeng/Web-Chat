import React, { useState } from "react";
import { Input, Avatar, List, message, Button } from "antd";
import request from "../api/request";
import { PlusOutlined, CheckOutlined } from '@ant-design/icons'
import setAvatar from "../utils/SetAvatar";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";

const { Search } = Input

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

interface GroupData {
  id: number,
  headImg: string,
  name: string,
  member: UserData[]
}

interface Props {
  id: number,
  keyword: string,
  updataKeyword: (value: string) => void,
  userList: UserData[],
  updataUserList: (value: UserData[]) => void,
  groupList: GroupData[],
  updataGroupList: (value: GroupData[]) => void,
  listSHow: boolean,
  updataListShow: (value: boolean) => void,
  handleOk: () => void,
  socket: React.MutableRefObject<Socket<any, any>>
}

export default function AddFriend(props: Props) {

  const onlineUsers: UserData[] = useSelector((state: any) => state.getOnlineUser.value)
  // console.log(onlineUsers)

  const { keyword,
    updataKeyword,
    userList,
    updataUserList,
    groupList,
    updataGroupList,
    listSHow,
    updataListShow,
    handleOk,
    id,
    socket } = props
  // console.log(socket.current.id)

  const [searchType, setSearchType] = useState<boolean>(false) //搜索的类型，false搜用户，true搜群

  const [messageApi, contextHolder] = message.useMessage()

  const [userData, setUserData] = useState<UserData>({ id: 0, username: '', password: '', name: '', headImg: '' })

  const [friendsList, setFriendsList] = useState<Array<UserData>>([])

  // 搜索用户
  const onSearch = () => {
    //先获取好友，已经是好友的不能再次添加
    const token: string = localStorage.getItem('token') as ''
    let data = JSON.parse(token)
    setUserData(data)
    request.get(`/friend?id=${id}`).catch(error => {
      console.log(error)
    }).then((res: any) => {
      setFriendsList(res.data)
    })
    updataListShow(true)
    //搜索用户
    if (keyword) {
      if (!searchType) {
        request.get('/search-user?keyword=' + keyword).catch(error => {
          console.log(error)
        }).then((res: any) => {
          updataUserList(res.data)
        })
      } else {
        request.get('/search-group?keyword=' + keyword).catch(error => {
          console.log(error)
        }).then((res: any) => {
          console.log(res.data)
          updataGroupList(res.data)
          // updataList(res.data)
        })
        console.log('搜群')
      }
    } else {
      messageApi.open({
        type: 'error',
        content: 'Please enter the username or name',
      });
    }
  }

  // 点击添加好友
  const addFriend = (userId: number, friendId: number) => {
    console.log(`${userId}向${friendId}发送了好友申请`)
    let data = {
      userId,
      friendId
    }
    let ifOnline = onlineUsers.find(item => {
      return item.id === friendId
    })
    if (ifOnline) {
      console.log('对方在线,发送socket请求')
      socket.current.emit('addFriend', data)
    } else {
      console.log('对方不在线,发送post请求')
      request({
        url: '/add-friend',
        method: 'post',
        data: JSON.stringify(data)
      }).catch(error => {
        console.log(error)
      }).then(res => {
        console.log(res)
      })
    }
    handleOk()
    messageApi.open({
      type: 'success',
      content: 'Successfully sent friend request',
    });
  }

  const switchSearchType = () => {
    setSearchType(!searchType)
    updataKeyword('')
    updataListShow(false)
  }

  const highlight = (value: any) => {
    const regex = new RegExp(keyword, 'g')
    let str = value.replace(regex, `<span style="color:#1677ff">${keyword}</span>`)
    // console.log(str)
    return str
  }

  return (
    <div style={{ minHeight: '60px' }}>
      {contextHolder}
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <Search placeholder={!searchType ? "Input username or name" : 'Input groupnumber or groupname'} onSearch={onSearch} value={keyword} onChange={(e) => {
          updataKeyword(e.target.value)
        }} style={{ width: 300 }} />
      </div>
      {listSHow && (
        !searchType ? (
          <List
            itemLayout="horizontal"
            pagination={{ pageSize: 5, position: 'bottom', align: 'center', hideOnSinglePage: true }}
            dataSource={userList}
            size='small'
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={<div dangerouslySetInnerHTML={{ __html: setAvatar(item.headImg) }} />} />}
                  title={(<span dangerouslySetInnerHTML={{ __html: highlight(`${item.name}( ${item.username})`) }}></span>)}
                  description={item.username}
                />
                {item.id === userData.id ? (<div>My</div>) : friendsList.map(key => key.id).includes(item.id) ? (
                  <div><CheckOutlined /></div>
                ) : (
                  <div style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => { addFriend(userData.id, item.id) }}>
                    <PlusOutlined />
                  </div>
                )}
              </List.Item>
            )}
          />) : (
          <List
            itemLayout="horizontal"
            pagination={{ pageSize: 5, position: 'bottom', align: 'center', hideOnSinglePage: true }}
            dataSource={groupList}
            size='small'
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.headImg} />}
                  title={(<span dangerouslySetInnerHTML={{ __html: highlight(`${item.name}( ${item.id})`) }}></span>)}
                  description={item.name}
                />
                {item.member.map(value => value.id).includes(userData.id) ? (<div><CheckOutlined /></div>) : (
                  <div style={{ fontSize: '16px', cursor: 'pointer' }}>
                    <PlusOutlined />
                  </div>
                )}
              </List.Item>
            )}
          />
        )
      )}
      <Button type="primary" disabled onClick={() => { switchSearchType() }}>{searchType ? 'Search User' : 'Search Group'}</Button>
    </div>
  )
}