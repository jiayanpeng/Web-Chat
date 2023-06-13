const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const { send } = require('process')
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 图片地址
let imgUrl = 'http://localhost:3001/img/'

// 用户列表
let userList = [{
  id: 1,
  username: 'xiaoming',
  password: '123456',
  name: '小明',
  headImg: imgUrl + 'xiaoming.jpg'
}, {
  id: 2,
  username: 'xiaoli',
  password: '123456',
  name: '小丽',
  headImg: imgUrl + 'xiaoli.jpg'
}]

// 当前在线的用户列表
let onlineUser = []

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json');
  next();
});

// 登陆接口
app.post('/login', (req, res) => {
  let status = 0
  let msg = '请求成功'
  let data = userList.find((item) => {
    return item = item.username === req.body.username && item.password === req.body.password
  })
  if (data) {
    // console.log('用户存在')
    // 判断当前的用户是否在onlineUser（在线用户列表）里面，有的话也不让他登陆，避免同时登陆两个一样的
    let isLogin = onlineUser.find(item => {
      return item.id == data.id
    })
    if (isLogin) {
      status = 2
      msg = '该用户已经登陆'
    }
  } else {
    // console.log('用户不存在')
    status = 1
    msg = '用户不存在'
  }
  res.send({
    msg: msg,
    status: status,
    data: data
  })
})

// 获取用户列表
app.get('/user', (req, res) => {
  res.send(userList)
})

io.on('connection', socket => {
  // 获取用户登陆信息
  socket.on('login', (data) => {
    data = JSON.parse(data)
    console.log(data.name + '加入链接')
    // 将登陆的用户加入到onlineUser（在线用户列表）
    let user = onlineUser.find(item => {
      return item = item.id === data.id
    })
    if (!user) {
      onlineUser = [...onlineUser, data]
    }
    console.log('当前登录的用户')
    console.log(onlineUser)
    // 将当前的用户信息和在线的用户列表广播出去
    io.emit('addUser', data, onlineUser)
  })
  // 获取退出的用户信息
  socket.on('disconnection', (data) => {
    console.log(data.name + '离开连接')
    // 将退出的用户从onlineUser（在线列表）里删除并
    onlineUser = onlineUser.filter(item => {
      return item.id !== data.id
    })
    // 把退出的用户和新的列表广播出去广播出去
    io.emit('outlogin', data, onlineUser)
    // console.log(onlineUser)
  })
  //发送接收消息 
  socket.on('sendMsg', (data) => {
    io.emit('recieveMsg', data)
  })

})

server.listen('3001', () => {
  console.log('服务器已启动')
})
