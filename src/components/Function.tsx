// 最左侧功能栏
import React, { useState } from "react";
import { Avatar, Modal, Form } from 'antd'
import MainStyle from '../views/Main.module.css'
import friendsImg from './img/user.png'
import friendsImgActive from './img/user-active.png'
import msgImg from './img/message.png'
import msgImgActive from './img/message-active.png'
import addFriendsImg from './img/add-friends.png'
import addFriendsImgActive from './img/add-friends-active.png'
import setImg from './img/set.png'
import setImgActive from './img/set-active.png'
import AddFriend from "./addFriend";
import SetUserForm from './setUserForm'
import { useSelector, useDispatch } from "react-redux"
import { setActiveRouter } from "../store/activeRouterSlice";

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

  const activeRouter = useSelector((state: any) => state.activeRouter.value)

  const dispath = useDispatch()

  let { userData } = props

  const [form] = Form.useForm()

  const [initialValues, setInitialValues] = useState<UserData>({ id: 0, username: '', password: '', name: '', headImg: '' })

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ifSet, setIfSet] = useState<Boolean>(false)

  const [ifAdd, setIfAdd] = useState<Boolean>(false)

  const [modalTitle, setModalTitle] = useState<string>('')

  const showModal = (value: string) => {
    setModalTitle(value)
    setIsModalOpen(true)
    setInitialValues(userData)
    if (value === 'Add Friends') {
      setIfAdd(true)
    } else {
      setIfSet(true)
    }

  };

  const handleOk = () => {
    setIsModalOpen(false)
    setIfSet(false)
    setIfAdd(false)
  };

  const handleCancel = () => {
    setIsModalOpen(false)
    setIfSet(false)
    setIfAdd(false)
  };

  return (
    <div className={MainStyle.funcBox}>

      {modalTitle === 'Add Friends' && (
        <Modal title={modalTitle} open={isModalOpen} onCancel={handleCancel} footer={null} >
          <AddFriend />
        </Modal>
      )}
      {modalTitle === 'Set Information' && (
        <Modal title={modalTitle} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
          <SetUserForm form={form} initialValues={initialValues} />
        </Modal>
      )}
      <div style={{ width: '100%', textAlign: 'center', margin: 'auto', paddingTop: '10px' }}>
        <Avatar size={50} src={userData.headImg} />
        <div className={MainStyle.funcBtnBox}>
          <div><img src={activeRouter === 'Message' ? msgImgActive : msgImg} alt="" onClick={() => { dispath(setActiveRouter('Message')) }} /></div>
          <div><img src={activeRouter === 'Friends' ? friendsImgActive : friendsImg} alt="" onClick={() => { dispath(setActiveRouter('Friends')) }} /></div>
          <div><img src={!ifAdd ? addFriendsImg : addFriendsImgActive} alt="" onClick={() => { showModal('Add Friends') }} /></div>
        </div>
      </div>
      <div className={MainStyle.funcSet}><img src={!ifSet ? setImg : setImgActive} alt="" onClick={() => { showModal('Set Information') }} /></div>
    </div>
  )
}