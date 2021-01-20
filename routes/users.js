var express = require('express');
var router = express.Router();

/* 추가한 부분 */
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var mssql = require('mssql');
var fs = require('fs');
/* 여기까지 */

const config = {
    // "user": "test",
    "user": "sa",
    "password": "qw12qw12",
    //"server": "192.168.137.1",
    "server": "192.168.0.134",
    // "server": "192.168.35.17",
    //"server"    : "192.168.0.135",
    "port": 1433,
    "database": "aTEST",
    // "timezone"  : 'utc',
    "options": {
        encrypt: false, // Use this if you're on Windows Azure 
        enableArithAbort: true
    }
}

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
    console.log("serializeUser ", user)
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log("deserializeUser user ", user)
    done(null, user);
});

// passport - username & password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'pw'
},
    function (username, password, done) {
        console.log('passport-local!!');
        try {
            mssql.connect(config, function (err) {

                console.log('Connect');
                var request = new mssql.Request();

                var queryString = "SELECT * FROM tALU WHERE ALU_email = '" + username + "' AND ALU_pw = '" + password + "'";

                request.query(queryString, function (err, result) {

                    // 입력받은 ID와 비밀번호에 일치하는 회원정보가 없는 경우   
                    if (result.rowsAffected[0] === 0) {

                        console.log("로그인 실패!");
                        return done(null, false);

                    } else {

                        console.log("로그인 성공!");
                        var json = JSON.stringify(result.recordset[0]);
                        var userinfo = JSON.parse(json);
                        return done(null, userinfo);  // result값으로 받아진 회원정보를 return해줌
                    }
                })
            });
        }
        catch (err) {
            console.log(err);
        }
    }
));

// 이메일로그인
router.post('/emaillogin', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        console.log('passport-local callback!');

        if (!user) {
            // 로그인실패
            return res.redirect('/login');
        }

        req.logIn(user, /* { session: false }, */ function (err) {

            if (err) {
                return next(err);
            } else {
                // 로그인성공
                req.session.save();
                console.log('emaillogin/callback user : ', req.user);
                var sid = req.sessionID;

                // db에 sid 업데이트
                try {
                    mssql.connect(config, function (err) {

                        console.log('Connect');
                        var request = new mssql.Request();

                        var queryString = "UPDATE tALU SET ALU_sid = '" + sid + "' WHERE ALU_email = '" + req.user.ALU_email + "'";

                        request.query(queryString, function (err, result) {

                            // user_session 쿠키 생성
                            res.cookie("user_session", sid, {
                                maxAge: 31536000000 // 1년
                            });

                            return res.redirect('/welcome');
                        })
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
    })(req, res, next);
});

router.get('/session', function (req, res, next) {
    try {

        console.log(req.headers.cookie);
        console.log('sessionID : ', req.sessionID);
    
        var cookie = req.headers.cookie;
        var splitHeader = cookie.split('connect.sid=s%3A');
        var splitDot = splitHeader[1].split('.');
        console.log('cookiesid : ', splitDot[0]);

        console.log('user_session : ', req.cookies.user_session);
        var user_session = req.cookies.user_session;

        let c_file = fs.readFileSync('sessions/' + user_session + '.json');

        let c_fileToJson = JSON.parse(c_file);
        //console.log('c_fileToJson.passport : ', c_fileToJson.passport);

        let c_jsonToString = JSON.stringify(c_fileToJson.passport);
        console.log('c_jsonToString : ', c_jsonToString);

        // 만약 user_session = req.sessionID 이면 sessions/....json 파일 업데이트 필요없음
        // 다르면 업데이트 필요
        if (user_session != req.sessionID) {
            let s_file = fs.readFileSync('sessions/' + req.sessionID + '.json');

            let s_fileToJson = JSON.parse(s_file);
            //console.log('s_fileToJson : ', s_fileToJson);

            let s_jsonToString = JSON.stringify(s_fileToJson);
            console.log('s_jsonToString : ', s_jsonToString);

            let sessionFile = s_jsonToString;
            let cookieFile = c_jsonToString;

            let str = s_jsonToString.substr(0, s_jsonToString.length-1);
            str = str + ',"passport":' + c_jsonToString;
            console.log('str : ', str);

            let data = JSON.parse(str);

            fs.writeFileSync('sessions/' + req.sessionID + '.json', data);
            // writeFile 말고 appendFile을 사용해보자!
        }

    } catch (err) {
        console.log(err);
    }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
