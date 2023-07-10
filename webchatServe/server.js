const express = require('express')
const app = express()
const server = require('http').createServer(app)
const { Server } = require('socket.io')
const bodyParser = require('body-parser')
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 用户列表
let userList = [{
  id: 1,
  username: 'xiaoming',
  password: '123456',
  name: '小明',
  headImg: '65478' //avatar
}, {
  id: 2,
  username: 'xiaoli',
  password: '251691',
  name: '小丽',
  headImg: '123154841218'
}, {
  id: 3,
  username: 'xiaomei',
  password: '123456',
  name: '小美',
  headImg: '1155151'
}]
//好友列表
let friendList = [{
  id: 1,
  friends: [{
    id: 2,
    username: 'xiaoli',
    password: '123456',
    name: '小丽',
    headImg: '123154841218'
  }, {
    id: 3,
    username: 'xiaomei',
    password: '123456',
    name: '小美',
    headImg: '1155151'
  }]
}, {
  id: 2,
  friends: [{
    id: 1,
    username: 'xiaoming',
    password: '123456',
    name: '小明',
    headImg: '65478' //avatar
  }]
}, {
  id: 3,
  friends: [{
    id: 1,
    username: 'xiaoming',
    password: '123456',
    name: '小明',
    headImg: '65478' //avatar
  }]
}]
//消息列表
let notices = [{
  id: 1,
  notice: []
}, {
  id: 2,
  notice: []
}, {
  id: 3,
  notice: []
}]
// 聊天群列表
let groups = [{
  id: '10000',
  headImg: 'http://localhost:3001/img/xiaoli.jpg',
  name: 'test groups',
  member: [{
    id: 1,
    username: 'xiaoming',
    password: '123456',
    name: '小明',
    headImg: '65478' //avatar
  }, {
    id: 2,
    username: 'xiaoli',
    password: '251691',
    name: '小丽',
    headImg: '123154841218'
  }, {
    id: 3,
    username: 'xiaomei',
    password: '123456',
    name: '小美',
    headImg: '1155151'
  }]
}, {
  id: '10001',
  headImg: 'http://localhost:3001/img/xiaoming.jpg',
  name: 'test two',
  member: [{
    id: 1,
    username: 'xiaoming',
    password: '123456',
    name: '小明',
    headImg: '65478' //avatar
  }, {
    id: 3,
    username: 'xiaomei',
    password: '123456',
    name: '小美',
    headImg: '1155151'
  }]
}]
//socket列表 
let sockets = []
// 当前在线的用户列表
let onlineUser = []

// 离线消息
let offlineMessageList = []

const getUser = (id) => {
  let data = userList.find(item => {
    return item = item.id == id
  })
  return data
}

const getSocket = (id) => {
  let data = sockets.find(item => {
    return item = item.id == id
  })
  return data
}

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
      msg = 'The user has login'
    }
  } else {
    // console.log('用户不存在')
    status = 1
    msg = 'User does not exist'
  }
  res.send({
    msg: msg,
    status: status,
    data: data
  })
})

//注册
app.post('/register', (req, res) => {
  let userId = Math.floor(Math.random() * 100000000000000)
  let user = {
    id: userId,
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    headImg: req.body.headImg
  }
  userList.push(user)
  friendList.push({
    id: userId,
    friends: []
  })
  notices.push({
    id: userId,
    notice: []
  })
  res.send('注册成功')
})

// 获取用户列表
app.get('/user', (req, res) => {
  res.send(userList)
})

// 获取好友列表
app.get('/friend', (req, res) => {
  // console.log(req.query.id)
  let data = friendList.find((item) => {
    return item = item.id == req.query.id
  })
  res.send(data.friends)
})

// 获取聊天群列表
app.get('/groups', (req, res) => {
  let id = req.query.id * 1
  console.log(id)
  let groupsList = groups.filter(item => {
    return item = item.member.find(item => item.id === id)
  })
  // console.log(groupsList)
  res.send(groupsList)
})

// 搜索用户
app.get('/search-user', (req, res) => {
  let keyword = req.query.keyword
  let list = userList.filter(item => {
    return item = item.username.includes(keyword) || item.name.includes(keyword)
  })
  // console.log(list)
  res.send(list)
})

// 搜索群聊
app.get('/search-group', (req, res) => {
  let keyword = req.query.keyword
  let list = groups.filter(item => {
    return item = item.name.includes(keyword) || item.id.includes(keyword)
  })
  console.log('搜群结果')
  console.log(list)
  res.send(list)
})

//添加好友
app.post('/add-friend', (req, res) => {
  let data = req.body
  let userId = data.userId
  let friendId = data.friendId
  let user = userList.find(item => {
    return item = item.id === userId
  })

  let friend = userList.find(item => {
    return item = item.id === friendId
  })
  console.log(`${user.name}向${friend.name}发起了好友申请`)

  notices = notices.map(item => {
    if (item.id === friend.id) {
      let userinfo = item.notice.find(item => {
        return item = item.id === user.id
      })
      // console.log(userinfo)
      if (!userinfo) {
        item.notice.push(user)
      }
    }
    return item
  })
  res.send('111')
})

//获取消息列表
app.get('/notices', (req, res) => {
  let id = req.query.id
  // console.log(id)
  let notice = notices.find(item => {
    return item = item.id == id
  })
  // console.log(notice.notice)
  let data = notice.notice
  res.send(data)
})

app.post('/handle-notice', (req, res) => {
  let userId = req.body.userId
  let friendId = req.body.friendId
  let handletype = req.body.handletype
  if (handletype == 0) {
    friendList.map(item => {
      if (item.id === userId) {
        item.friends.push(getUser(friendId))
      } else if (item.id === friendId) {
        item.friends.push(getUser(userId))
      }
    })
  }
  let friend = userList.find(item => {
    return item = item.id === friendId
  })
  notices = notices.map(item => {
    if (item.id === friend.id) {
      let userinfo = item.notice.find(item => {
        return item = item.id === userId
      })
      console.log(userinfo)
      item.notice = item.notice.filter(item => {
        return item = item.id !== userinfo.id
      })
    }
    return item
  })
  console.log(notices)
  res.send('')
})

io.on('connection', socket => {
  // console.log(socket.id)
  // 获取用户登陆信息
  socket.on('login', (data) => {
    data = JSON.parse(data)
    // console.log(data.name + '加入链接', socket.id)
    // 将登陆的用户加入到onlineUser（在线用户列表）
    let user = onlineUser.find(item => {
      return item = item.id === data.id
    })
    if (!user) {
      onlineUser = [...onlineUser, data]
    }
    console.log('当前登录的用户')
    console.log(onlineUser)
    sockets = [...sockets, { id: data.id, socketId: socket.id }]
    // console.log('当前所有的socket连接')
    // console.log(sockets)
    // 将当前的用户信息和在线的用户列表广播出去
    io.emit('addUser', data, onlineUser)
  })
  // 获取退出的用户信息
  socket.on('disconnection', (data) => {
    // console.log(data.name + '离开连接')
    // 将退出的用户从onlineUser（在线列表）里删除并
    onlineUser = onlineUser.filter(item => {
      return item.id !== data.id
    })
    sockets = sockets.filter(item => {
      return item.id !== data.id
    })
    // 把退出的用户和新的列表广播出去广播出去
    io.emit('outlogin', data, onlineUser)
    console.log('用户离开后的列表')
    // console.log(sockets)
    console.log(onlineUser)
  })
  //发送接收消息 
  socket.on('sendMsg', (data) => {
    console.log(data)
    let friend = getUser(data.friendId)
    let socket = getSocket(friend.id)
    console.log(socket)
    if (socket) {
      io.to(socket.socketId).emit('recieveMsg', data)
    } else {
      console.log('对方离线')
      // offlineMessageList.push(data)
      // console.log(offlineMessageList)
    }
  })
  //添加好友
  socket.on('addFriend', (data) => {
    let userId = data.userId
    let friendId = data.friendId
    let user = userList.find(item => {
      return item = item.id === userId
    })

    let friend = userList.find(item => {
      return item = item.id === friendId
    })
    console.log(`${user.name}向${friend.name}发起了好友申请`)
    notices = notices.map(item => {
      if (item.id === friend.id) {
        let userinfo = item.notice.find(item => {
          return item = item.id === user.id
        })
        // console.log(userinfo)
        if (!userinfo) {
          item.notice.push(user)
        }
      }
      return item
    })
    // console.log(notices)
    let notice = notices.find(item => {
      return item = item.id == friendId
    })
    let userSocketId = sockets.find(item => {
      return item = item.id == friendId
    })
    console.log(notice.notice)
    io.to(userSocketId.socketId).emit('getNotice', notice.notice)
  })

  //处理通知
  socket.on('handleNotice', (data) => {
    console.log('监听到处理通知')
    // console.log(data)
    let user = getUser(data.userId)
    let friend = getUser(data.friendId)
    let userSocket = getSocket(data.userId)
    let friendSocket = getSocket(data.friendId)
    // console.log('申请人')
    // console.log(user)
    // console.log('被申请人')
    // console.log(friend)
    io.to(friendSocket.socketId).emit('newFriend-newMessage', user)
    if (userSocket) {
      io.to(userSocket.socketId).emit('newFriend', friend)
    }
  })

})

server.listen('3001', () => {
  console.log('服务器已启动')
})
