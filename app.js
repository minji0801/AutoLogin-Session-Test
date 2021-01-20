var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
var FileStore = require('session-file-store')(session)
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

const request = require('request');

var app = express();

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore(),
  cookie: {
    httpOnly: true,
    secure: false
  }
}))

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json({ limit : "50mb" })); 
app.use(express.urlencoded({ limit:"50mb", extended: true ,parameterLimit:50000}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/////////////////////////// 통신부


var server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(8087, function() {
    console.log('Socket IO server listening on port 8087');
});


io.on('connection', function(socket) {
  console.log('Socket id ' + socket.id + 'Connected');

  // 방에 대한 정보는 따로 가지고 있어야 한다.
  // 로그아웃 하면 방을 나가야하는데 현재 socket의 방 정보를 어떻게 가져와야 하나?
  // Disconnect 하면 자동으로 끊기기는 하지만
  // 끊는 로직을 하나 만들어야 할꺼같다.

  // 이방에서 있다가 저방으로 가면
  // 이래서 방 개설이라는게 있구나....
  // 아니면 로그인 하면 모든 방에 Join을 해둬야 하나?
  // 하면은 여러개를 받고 해당 내용 Response 받아가지고 처리가 가능해지나?


  socket.on('disconnect', () => {
    console.log('disconnected');
    // socket.socket.reconnectionDelay /= 2;
  });

  socket.on('Login', function(data) {
      console.log('Client logged-in:\n name:' + data.B_Name + '\n userid: ' + data.B_Login_ID);

      socket.name = data.B_Name;
      socket.userid = data.B_Login_ID;

      // Room 정보 파싱이 안됨...
      // 그냥 정보 보내고 할때 Room 정보를 가져오게 하자
      console.log('socket info set');

      // 로그인 사용자에 따라서 Join을 다시 걸어준다.
      // if(data.name == "us.Kim") {
      //   socket.join("room1");
      // } else {
      //   socket.join("room2");
      // }
      //socket.join("room1");

      // 이곳에서 post 보내는 방법
      // 서버에서 동작하기 때문에 127.0.0.1로 해도 될것 같다.
      const options = {
        uri:'http://127.0.0.1:8087/api/chat_list', 
        body: { pB_IDs:data.B_IDs },
        json: true
      }

      // 해당 방식을 통해서 API와 통신 가능
      request.post(options, function (err,httpResponse,body) {
          //console.log(body.data.length);

          for(i=0; i<body.data.length; i++) {
            socket.join(body.data[i].CRU_CR_IDs);

            console.log('join : ' + body.data[i].CRU_CR_IDs);
          }

          console.log('login end');
          //client.send("post req called",postdata);
      });

  });

  socket.on('Message', function(data) {
    // console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

    // socket.name = data.name;
    // socket.userid = data.userid;

    // // Room 정보 파싱이 안됨...
    // // 그냥 정보 보내고 할때 Room 정보를 가져오게 하자
    // console.log('socket info set');

    // socket.broadcast.to('room2').emit('login_user', data.userid);

    // // 이곳에서 post 보내는 방법
    // // 서버에서 동작하기 때문에 127.0.0.1로 해도 될것 같다.
    // const options = {
    //   uri:'http://127.0.0.1:8087/api/test', 
    //   body: { name:data.name, userid:data.userid },
    //   json: true
    // }

    // // 해당 방식을 통해서 API와 통신 가능
    // request.post(options, function (err,httpResponse,body) {
    //     console.log(body);
    //     //client.send("post req called",postdata);
    // });

    const options = {
      uri:'http://127.0.0.1:8087/api/insert_chat_detail', 
      body: { pB_IDs:data.B_IDs, pCR_IDs:data.CR_IDs, pMessage:data.message},
      json: true
    }

    // 해당 방식을 통해서 API와 통신 가능
    request.post(options, function (err,httpResponse,body) {
        //console.log(body.data.length);
        //client.send("post req called",postdata);
    });

    console.log("socket Name : " + socket.name);

    socket.broadcast.to(data.CR_IDs).emit('Message_Res', {
        message : data.message,
        CR_IDs : data.CR_IDs,
        writeName : socket.name
    });

    socket.emit('Message_Suc', 
      {
        success:'OK'
      }
    );

    console.log('Message end');
  });

  socket.on('File', function(data) {
    
    const options = {
      uri:'http://127.0.0.1:8087/api/insert_chat_detail_file', 
      body: { pB_IDs:data.B_IDs, pCR_IDs:data.CR_IDs, pMessage:data.message, pFileName: data.fileName},
      json: true
    }

    // 해당 방식을 통해서 API와 통신 가능
    request.post(options, function (err,httpResponse,body) {
        //console.log(body.data.length);
        //client.send("post req called",postdata);
    });

    console.log("socket Name : " + socket.name);

    socket.broadcast.to(data.CR_IDs).emit('Message_Res_file', {
        message : data.message,
        fileName : data.fileName,
        CR_IDs : data.CR_IDs,
        writeName : socket.name,
        type : 'file'
    });

    socket.emit('Message_Suc', 
      {
        success:'OK'
      }
    );

    console.log('Message end');
  });

  console.log("Connect")
});





module.exports = app;
