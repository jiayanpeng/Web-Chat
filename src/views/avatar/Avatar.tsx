import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Button, Card, message, Spin } from 'antd';
import setAvatar from '../../utils/SetAvatar';
import AvatarStyle from './Avatar.module.css'
import request from '../../api/request';
import { LoadingOutlined } from '@ant-design/icons';

interface UserData {
  username: string,
  password: string,
  name: string,
  headImg: string
}

export default function Avatars() {

  const state = useLocation()

  const navigate = useNavigate()

  const [avatarSrc, setAvatarSrc] = useState('')

  const [avatarList, setAvatarList] = useState<Array<string>>([])

  const [userData, setUserData] = useState<UserData>({ username: '', password: '', name: '', headImg: '' })

  const [messageApi, contextHolder] = message.useMessage()

  const [loading, setLoading] = useState<boolean>(false)

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(() => {
    createAvatar()
  }, [])

  const createAvatar = () => {
    let list: string[] = []
    for (let i = 1; i <= 4; i++) {
      let value = Math.floor(Math.random() * 100000000000000)
      // console.log(value)
      list.push(`${value}`)
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setAvatarList(list)
    }, 500)
  }

  const chooseAvatar = (value: string) => {
    setAvatarSrc(value)
    let data = {
      username: state.state.username,
      password: state.state.password,
      name: state.state.name,
      headImg: value
    }
    console.log(data)
    setUserData(data)
  }

  const subInfo = () => {
    request({
      url: '/register',
      method: 'post',
      data: userData
    }).catch(error => {
      console.log(error)
    }).then((res: any) => {
      console.log(res.data)
      messageApi.open({
        type: 'success',
        content: res.data
      })
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        navigate('/login')
      }, 1500)
    })
  }

  return (
    <div className={AvatarStyle.mainBox}>
      {contextHolder}
      {
        loading && (
          <div className={AvatarStyle.mask}><Spin className={AvatarStyle.loading} indicator={antIcon} /></div>
        )
      }
      <Card title='Choose your avatar' className={AvatarStyle.box}>
        <div className={AvatarStyle.avatarFlex}>
          {
            avatarList.map((item, index) => {
              return (
                <div key={index} className={AvatarStyle.avatar} style={{ backgroundColor: avatarSrc === item ? '#551a8b' : '' }} >
                  <Avatar
                    className={AvatarStyle.avatarImg}
                    size={80}
                    src={<div dangerouslySetInnerHTML={{ __html: setAvatar(item) }} />}
                    onClick={() => { chooseAvatar(item) }}
                  />
                </div>
              )
            })
          }
        </div>
        <span className={AvatarStyle.textButton}>Any favourite?
          <span onClick={() => { createAvatar() }}>Change to another group</span>
        </span>
        <Button className={AvatarStyle.button} type="primary" onClick={() => { subInfo() }} >Ok</Button>
      </Card>
    </div>
  )
}
