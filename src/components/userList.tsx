// 消息和好友列表
import React from "react";
import { Avatar, List } from 'antd';
import MainStyle from '../views/Main.module.css';
import { useSelector } from "react-redux";

interface UserData {
  id: number,
  username: string,
  password: string,
  name: string,
  headImg: string
}

interface Props {
  userList: UserData[]
}

export default function UserList(props: Props) {

  const { userList } = props

  const activeRouter = useSelector((state: any) => state.activeRouter.value)

  return (
    <div className={MainStyle.userList}>
      <div className={MainStyle.title}>{activeRouter} list</div>
      <List
        itemLayout="horizontal"
        dataSource={userList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.headImg} />}
              title={item.name}
            />
          </List.Item>
        )}
      />
    </div>
  )
}