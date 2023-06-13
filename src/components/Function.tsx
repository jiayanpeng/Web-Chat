// 最左侧功能栏
import React from "react";
import { Avatar } from 'antd'

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

interface Props {
  userData: UserData
}

export default function Function(props: Props) {

  let { userData } = props

  return (
    <div>
      <div style={{ width: '100%', textAlign: 'center', margin: 'auto', paddingTop: '10px' }}>
        <Avatar size={50} src={userData.headImg} />
      </div>
    </div>
  )
}