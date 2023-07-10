// 最左侧功能栏
import React, { useState } from "react";
import { Avatar, Modal, Form } from 'antd';
import MainStyle from '../views/Main.module.css';
import friendsImg from './img/user.png';
import friendsImgActive from './img/user-active.png';
import msgImg from './img/message.png';
import msgImgActive from './img/message-active.png';
import addFriendsImg from './img/add-friends.png';
import addFriendsImgActive from './img/add-friends-active.png';
import noticeImg from './img/notice.png';
import noticeImgActive from './img/notice-active.png';
import setImg from './img/set.png';
import setImgActive from './img/set-active.png';
import AddFriend from "./AddFriend";
import SetUserForm from './SetUserForm';
import Notice from "./Notice";
import { useSelector, useDispatch } from "react-redux";
import { setActiveRouter } from "../store/activeRouterSlice";
import setAvatar from "../utils/SetAvatar";
import { Socket } from "socket.io-client";

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
  userData: UserData,
  socket: React.MutableRefObject<Socket<any, any>>
}

export default function Function(props: Props) {

  const socket = props.socket

  const activeRouter = useSelector((state: any) => state.activeRouter.value)

  const setNotice: UserData[] = useSelector((state: any) => state.getNotice.value)

  const dispath = useDispatch()

  let { userData } = props

  const [form] = Form.useForm()

  const [initialValues, setInitialValues] = useState<UserData>({ id: 0, username: '', password: '', name: '', headImg: '' })

  const [keyword, setKeyword] = useState<string>('')

  const [userList, setUserList] = useState<Array<UserData>>([])

  const [groupList, setGroupsList] = useState<Array<GroupData>>([])

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ifSet, setIfSet] = useState<Boolean>(false)

  const [ifAdd, setIfAdd] = useState<Boolean>(false)

  const [ifNotice, setIfNotice] = useState<boolean>(false)

  const [listShow, setListShow] = useState<boolean>(false)

  const [modalTitle, setModalTitle] = useState<string>('')

  const showModal = (value: string) => {
    setModalTitle(value)
    setIsModalOpen(true)
    setInitialValues(userData)
    if (value === 'Add Friends') {
      setIfAdd(true)
    } else if (value === 'Set Information') {
      setIfSet(true)
    } else {
      setIfNotice(true)
    }

  };

  const handleOk = () => {
    setIsModalOpen(false)
    setIfSet(false)
    setIfAdd(false)
    setKeyword('')
    setUserList([])
    setListShow(false)
    setIfNotice(false)
  };

  const handleCancel = () => {
    setIsModalOpen(false)
    setIfSet(false)
    setIfAdd(false)
    setKeyword('')
    setUserList([])
    setListShow(false)
    setIfNotice(false)
  };

  const updataKeyword = (value: string) => {
    setKeyword(value)
  }

  const updataUserList = (data: UserData[]) => {
    setUserList(data)
  }

  const updataGroupList = (data: GroupData[]) => {
    setGroupsList(data)
  }

  const updataListShow = (value: boolean) => {
    setListShow(value)
  }

  return (
    <div className={MainStyle.funcBox}>
      {modalTitle === 'Add Friends' && (
        <Modal title={`${modalTitle} Or Group`} open={isModalOpen} onCancel={handleCancel} footer={null} >
          <AddFriend
            keyword={keyword}
            updataKeyword={updataKeyword}
            userList={userList}
            updataUserList={updataUserList}
            groupList={groupList}
            updataGroupList={updataGroupList}
            listSHow={listShow}
            updataListShow={updataListShow}
            handleOk={handleOk}
            id={userData.id}
            socket={socket}
          />
        </Modal>
      )}
      {modalTitle === 'Notice' && (
        <Modal title={modalTitle} open={isModalOpen} onCancel={handleCancel} footer={null} >
          <Notice socket={socket} />
        </Modal>
      )}
      {modalTitle === 'Set Information' && (
        <Modal title={modalTitle} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
          <SetUserForm form={form} initialValues={initialValues} />
        </Modal>
      )}
      <div style={{ width: '100%', textAlign: 'center', margin: 'auto', paddingTop: '10px' }}>
        <Avatar size={50} src={<div dangerouslySetInnerHTML={{ __html: setAvatar(userData.headImg) }} />} />
        <div className={MainStyle.funcBtnBox}>
          <div><img src={activeRouter === 'Message' ? msgImgActive : msgImg} alt="" onClick={() => { dispath(setActiveRouter('Message')) }} /></div>
          <div><img src={activeRouter === 'Friends' ? friendsImgActive : friendsImg} alt="" onClick={() => { dispath(setActiveRouter('Friends')) }} /></div>
          <div><img src={!ifAdd ? addFriendsImg : addFriendsImgActive} alt="" onClick={() => { showModal('Add Friends') }} /></div>
          <div style={{ position: 'relative' }}>
            <img src={!ifNotice ? noticeImg : noticeImgActive} alt="" onClick={() => { showModal('Notice') }} />
            {setNotice.length !== 0 && (
              <div className={MainStyle.prompt} onClick={() => { showModal('Notice') }} >{setNotice.length < 10 ? setNotice.length : 'N'}</div>
            )}
          </div>
        </div>
      </div>
      <div className={MainStyle.funcSet}><img src={!ifSet ? setImg : setImgActive} alt="" onClick={() => { showModal('Set Information') }} /></div>
    </div>
  )
}