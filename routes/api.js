
const { json } = require('body-parser');
const { request } = require('express');
var express = require('express');
var router = express.Router();
const mssql = require('mssql');
const multer = require('multer');
const path = require('path');
/* GET home page. */

const nodemailer = require("nodemailer");

const fs = require('fs');
const emlformat = require('eml-format');


const jsdom = require('jsdom');   
const { JSDOM } = jsdom;  

// var DomParser = require('dom-parser');


const config = {
            // "user"      : "sa",
            // "password"  : "qw12qw12)",
            // "server"    : "192.168.0.122",
            // "port"      : 1433,
            // "database"  : "aTEST",
            // "timezone"  : 'utc',
            // "options"   : {
            //     "encrypt" : false
            // }
        "user"      : "sa",
        "password"  : "qw12qw12",
        //"server"    : "192.168.0.181",
         "server"    : "192.168.0.135",
        "port"      : 1433,
        "database"  : "aTEST",
        // "timezone"  : 'utc',
        "options"   : {
            encrypt: false, // Use this if you're on Windows Azure 
            enableArithAbort: true
         }
}





router.post('/login', function(req, res, next) {
    try {
        console.log('login');

        mssql.connect(config, function (err) {

            var request = new mssql.Request();
            // console.log(req.body.pId + ":" + req.body.pPwd)

            var queryString = "EXEC p__Login '" + req.body.pId + "', '" + req.body.pPwd + "'";

            // console.log(queryString);

            request.query(queryString, function (err, result) {
                // console.log(result.recordset);
                if(result.recordset.length > 0) {
                    res.json({result : 'login', data : result.recordset});
                } 
                else {
                    res.json({result : 'login error'} );
                }
            });
        });

    } catch (err) {
        console.log('error fire')
        res.json({data : 'login error'} );
    }
});

router.post('/chat_list', function(req, res, next) {
    try {
        console.log('chat_list');

        mssql.connect(config, function (err) {

            var request = new mssql.Request();
            // console.log(req.body.pB_IDs)

            var queryString = "EXEC p__ChatList '" + req.body.pB_IDs + "'";

            // console.log(queryString);

            request.query(queryString, function (err, result) {
                // console.log(result.recordset);
                
                res.json({result : 'success', data : result.recordset});
            });
        });

    } catch (err) {
        console.log('error fire')
        res.json({data : 'chat_list error'} );
    }
});

router.post('/chat_details', function(req, res, next) {
    try {
        console.log('chat_details');

        mssql.connect(config, function (err) {

            var request = new mssql.Request();
            //console.log(req.body.pCR_IDs)

            var queryString = "EXEC p__ChatDetail '" + req.body.pCR_IDs + "'";

            //console.log(queryString);

            request.query(queryString, function (err, result) {
                //console.log(result.recordset);
                
                res.json({result : 'success', data : result.recordset});
            });
        });

    } catch (err) {
        console.log('error fire')
        res.json({data : 'chat_details error'} );
    }
});

router.post('/insert_chat_detail', function(req, res, next) {
    try {
        console.log('insert_chat_detail');

        mssql.connect(config, function (err) {

            var request = new mssql.Request();
            //console.log(req.body.pCR_IDs)

            var queryString = "EXEC p__ChatInsert '" + req.body.pB_IDs + "', '" + req.body.pCR_IDs + "','" + req.body.pMessage + "'";

            //console.log(queryString);

            request.query(queryString, function (err, result) {
            });
        });
        
    } catch (err) {
        console.log('error fire')
        res.json({data : 'insert_chat_detail error'} );
    }

});

router.post('/insert_chat_detail_file', function(req, res, next) {
    try {
        console.log('insert_chat_detail_file');

        mssql.connect(config, function (err) {

            var request = new mssql.Request();
            //console.log(req.body.pCR_IDs)

            var queryString = "EXEC p__ChatInsertFile '" + req.body.pB_IDs + "', '" + req.body.pCR_IDs + "','" + req.body.pMessage + "', '" + req.body.pFileName + "'";

            //console.log(queryString);

            request.query(queryString, function (err, result) {
            });
        });
        
    } catch (err) {
        console.log('error fire')
        res.json({data : 'insert_chat_detail_file error'} );
    }

});

//multer 의 diskStorage를 정의
const storageControl = multer.diskStorage({
    //경로 설정
    // destination : function(req, file, cb){    
    //   cb(null, '_tmp_files/');
    // },
  
    //실제 저장되는 파일명 설정
    // filename : function(req, file, cb){
    //     //파일명을 동적으로 지정해 줄때
    //     //사용자 함수는 파일 확장자를 온전히 포함한 파일명을 반환해야 합니다.
    //     // var file_name = req.body.filename;
    //     // switch (file.mimetype) {
    //     // case "image/jpeg":
    //     //     mimeType = "jpg";
    //     // break;
    //     // case "image/png":
    //     //     mimeType = "png";
    //     // break;
    //     // case "image/gif":
    //     //     mimeType = "gif";
    //     // break;
    //     // case "image/bmp":
    //     //     mimeType = "bmp";
    //     // break;
    //     // default:
    //     //     mimeType = "jpg";
    //     // break;
    //     // 

    //     // cb(null, file_name + "." + mimeType);

    //     // 하나 들어올때마다 설정
    //     // 

    //     //console.log('storage_file_name',file);
    //     //파일 저장자 이름을 사용자가 올린 파일의 이름과 확장자로 지정함
    //     //cb(null, file.originalname);

        


    //     // mssql.connect(config, function (err) {

    //     //     var request = new mssql.Request();
    //     //     //console.log(req.body.pCR_IDs)

    //     //     var queryString = "EXEC p__ChatInsert '" + req.body.pB_IDs + "', '" + req.body.pCR_IDs + "','" + req.body.pMessage + "'";

    //     //     //console.log(queryString);

    //     //     request.query(queryString, function (err, result) {
    //     //     });
    //     // });
    // }
  });
  
const upload = multer({storage: null});

//경로를 지정하고 별도의 파일 설정을 하지않고 저장함
// const upload = multer({dest : '_tmp_files/'});

router.post('/fileUpload', upload.any(), function(req, res, next) {
    try {
        console.log('fileUpload');
        console.log('B_IDs : ' + req.body.B_IDs);
        console.log('CR_IDs : ' + req.body.CR_IDs);
        console.log(req.files);
        //console.log(req);

        // req.files 내용
        // fieldname: 필드명
        // originalname: 파일명
        // encoding
        // minietype: 타입
        // buffer
        // size : 크기

        // 파일 저장과 관련해서 _tmp_files가 아니라 내가 원하는곳에 저장하게 해보자
        // 이쪽에서 되어야 한번에 처리할 수 있는 로직이 생성된다.
        
        var fs = require('fs');

        var jsonString = '[';

        var uploadNameList = new Array();

        for(var i=0; i<req.files.length; i++) {
            var buffer = Buffer.from(req.files[i].buffer, 'base64');

            // 파일 저장
            //path 모듈 설치 후 경로를 지정해줌 마지막 / 는 뒤에 파일명이 붙기때문에 추가함
            let filePath = path.join(__dirname, '..','/public/upload/');

            // 시분초 가져오기
            var uploadName = Date.now() + "_" + req.files[i].originalname;

            uploadNameList.push(uploadName);

            fs.writeFileSync(filePath + uploadName, buffer, function(err){
                if(err){
                    console.log('upload 에러발생 :', err);
                }
                console.log('완료');
            });

            jsonString += '{"fileName":"' +  uploadName + '", "originalName" :"' +  req.files[i].originalname + '"},';
        }

        jsonString = jsonString.substring(0,jsonString.length - 1);

        jsonString += ']';

        res.json({B_IDs : req.body.B_IDs, CR_IDs : req.body.CR_IDs, files : JSON.parse(jsonString), uploadNameList : uploadNameList})
        
        // 
    } catch (err) {
        console.log('error fire :' + err)
        res.json({data : 'fileUpload error'} );
    }

});

// \public\upload 경로에 있는 파일 삭제
router.post('/fileDelete', upload.any(), function(req, res, next) {
    try {
        console.log('fileDelete');
        console.log('fileName : ' + req.body.fileName);

        // 파일 삭제
        var fs = require('fs');
        
        let filePath = path.join(__dirname, '..','/public/upload/');
        fs.unlinkSync(filePath + req.body.fileName);

    } catch (err) {
        console.log('error fire : ' + err)
        res.json({data : 'chat_list error'} );
    }
});

router.post('/mail_list', function(req, res, next) {
    try {
        console.log('mail_list');

        mssql.connect(config, function (err) {

            var request = new mssql.Request();
            // console.log(req.body.pB_IDs)

            var queryString = "EXEC p__EML";

            // console.log(queryString);

            request.query(queryString, function (err, result) {
                // console.log(result.recordset);
                
                res.json({result : 'success', data : result.recordset});
            });
        });

    } catch (err) {
        console.log('error fire')
        res.json({data : 'chat_list error'} );
    }
});

router.get('/getContents/:EML_ID', function(req, res, next) {
    try {
        console.log('getContents');

        mssql.connect(config, function (err) {

            var request = new mssql.Request();
            // console.log(req.body.pB_IDs)
            
            console.log(req.params);

            var queryString = "EXEC p__EML " + req.params.EML_ID;

            console.log(queryString);

            request.query(queryString, function (err, result) {
                // console.log(result.recordset);
                // 한개의 쿼리에서 SELECT 2개 해서 가져올 수 있는지 확인해볼 것
                // 2개를 가지고 오지 못함
                // 프로시저에서는 2개를 반환함

                var attachQueryString = "EXEC p__EMLA " + req.params.EML_ID;

                console.log(attachQueryString);

                request.query(attachQueryString, function (err, attResult) {
                    res.json({result : 'success', data : result.recordset, attach : attResult.recordset });
                });
            });
        });

    } catch (err) {
        console.log('error fire')
        res.json({data : 'chat_list error'} );
    }
});

// chilkat은 라이센스 존재
// var os = require('os');

// if (os.platform() == 'win32') {  
//     if (os.arch() == 'ia32') {
//         var chilkat = require('@chilkat/ck-node12-win-ia32');
//     } else {
//         var chilkat = require('@chilkat/ck-node12-win64'); 
//     }
// } 
// else if (os.platform() == 'linux') {
//     if (os.arch() == 'arm') {
//         var chilkat = require('@chilkat/ck-node12-arm');
//     } else if (os.arch() == 'x86') {
//         var chilkat = require('@chilkat/ck-node12-linux32');
//     } else {
//         var chilkat = require('@chilkat/ck-node12-linux64');
//     }
// } 
// else if (os.platform() == 'darwin') {
//     var chilkat = require('@chilkat/ck-node12-macosx');
// }

// function chilkatExample() {

//     // This example requires the Chilkat API to have been previously unlocked.
//     // See Global Unlock Sample for sample code.

//     var email = new chilkat.Email();

//     // Adding attachments, HTML/plain-text bodies, etc can be done
//     // in any order:

//     // Add an attachment
//     // var contentType = email.AddFileAttachment("hamlet.zip");
//     // if (email.LastMethodSuccess !== true) {
//     //     console.log(email.LastErrorText);
//     //     return;
//     // }

//     // Add some headers:
//     email.Subject = "This is a complex email";
//     var success = email.AddTo("Chilkat Support","support@chilkatsoft.com");
//     email.From = "Matt <matt@chilkatsoft.com>";

//     // Add a plain-text body:
//     success = email.AddPlainTextAlternativeBody("This is the plain-text body");

//     // Add an image that will be embedded in the HTML body.
//     // var contentIdDude = email.AddRelatedFile("dude.gif");
//     // if (email.LastMethodSuccess !== true) {
//     //     console.log(email.LastErrorText);
//     //     return;
//     // }

//     // Update the CONTENT_ID_DUDE to the actual content ID when sending the email.
//     // success = email.SetReplacePattern("CONTENT_ID_DUDE",contentIdDude);

//     // Add an HTML body:
//     var html;
//     html = "<html><body><b>This is the HTML body</b><br><img src=\"cid:CONTENT_ID_DUDE\"></body></html>";

//     success = email.AddHtmlAlternativeBody(html);

//     // Save the email as a .eml

//     let filePath = path.join(__dirname, '..','/public/eml/');

//     success = email.SaveEml(filePath + "complex.eml");
//     if (success !== true) {
//         console.log(email.LastErrorText);
//     }
//     else {
//         console.log("Created email!");
//     }
// }


// var MailComposer = require("mailcomposer").MailComposer;
const MailComposer = require("nodemailer/lib/mail-composer");
const { Console } = require('console');
// mailComposer 사용 안됨
// addHeader 부터 메소드를 인식 못한다고 함

        // var mailcomposer = new MailComposer();
        // var fs = require("fs");

        // // add additional header field
        // mailcomposer.addHeader("x-mailer", "Nodemailer 1.0");

        // // setup message data
        // mailcomposer.setMessageOption({
        //     from: "andris@tr.ee",
        //     to: "andris@node.ee",
        //     body: "Hello world!",
        //     html: "<b>Hello world!</b>"
        // });

        // mailcomposer.streamMessage();

        // // pipe the output to a file
        // mailcomposer.pipe(fs.createWriteStream("test.eml"));
router.post('/sendMail', upload.any(), async function(req, res, next) {
    try {
        console.log('api : sendMail');
        console.log('받는사람 : ' + req.body.pTo);
        console.log(req.files);
        console.log(Object.keys(req.body.pUploadName).length);
        for(i=0; i<req.body.pUploadName.length; i++) {  // 1개면 글자길이를 가져온다..(오류수정 필요)
            console.log('파일 : ' + req.body.pUploadName[i]);
        } 
        //console.log(req);
        
        /* const arr = req.body.pfilename.split(",");
        console.log('파일수 : ' + arr.length); */
        
        
        let transporter = nodemailer.createTransport({
            host: "smtp.daum.net",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "yuriminfo", // generated ethereal user
                pass: "dbfla1212))", // generated ethereal password
            }
        });

        // html Text 중 이미지와 관련된 부분은 Parsing 이 필요하다. -> 안보이게 해주는애들이 대부분임 -> 물론 설정을 바꾸면 보일순 있지만...
        // 우리 메일 쓰는데 설정바꾸라고 하는부분은 아닌듯
        // 파싱하는 방법이 필요하다.
        // 링크로 된 부분은 그대로 보내도 되지만
        // Data로 된 부분은 바꿔줘야 한다.
        // data로 되는 부분 추출 필요


        // console.log(req.body.pHtmlText);

        var regex = /^data:.+\/(.+);base64,(.*)$/;

        const dom = new JSDOM(req.body.pHtmlText);

        // Body Parsing 부

        //const html = new DomParser().parseFromString(, "text/html");
        // console.log(html);

        console.log(dom.window.document);

        // img tag가 여러개인데 하나밖에 못가져온다
        // All 로 가져오면 전체 가져옴
        var imgTag = dom.window.document.querySelectorAll("img");
        //console.log(imgTag.src);
        console.log(imgTag.length);

        // 첨부파일 부분
        var attachment = '[';

        // 첨부되는 이미지와 관련해서 연구좀 해봐야 할듯?
        // 우선 HTML에 Data로 된부분은 따로 보내도록 변경 되었음

        for(var i=0; i<imgTag.length; i++) { 
            // src를 가져오는것 까지는 되는데 setAttribute가 안된다.
            var imgData = imgTag[i].src;

            var matches = imgData.match(regex);

            if(matches != null && matches.length > 1) {
                var ext = matches[1]; // 확장자
                //var data = matches[2]; // 데이터
                //var buffer = Buffer.from(data, 'base64');
                //console.log(buffer.toString('utf-8'));

                if(i!=0) {
                    attachment += ","
                }

                attachment += 
                    '{ "filename": "' + i + "." + ext + '"' +
                    ', "path": "' + imgData + '"' + 
                    ', "cid":"' + i + "." + ext +
                    '"}';

                imgTag[i].src = 'cid:' + i + "." + ext;

                
            } else {}
        }
        let uploadPath = path.join(__dirname, '..','/public/upload/');

        // json에서 \를 인식하지 못한다.. \를 /로 바꿔주자.
        var filePath = uploadPath.replace(/\\/g,"/");
        console.log("filePath : " + filePath);

        if(req.files.length != 0) {
            // 첨부파일이 있으면 attachment 구문 넣어주기

            for(var i=0; i<req.files.length; i++) {

                if (i == 0) {   // , 구분해서 작성 
                    attachment += '{ "filename": "' + req.files[i].originalname + '"' + 
                    ', "path":"' + filePath + req.body.pUploadName[i] + '" }';
                    // path를 \upload\ 의 파일로 해주려고 하는데
                    // \upload\ 의 파일명을 어떻게 가져올까..
                    // fileupload할때 res값으로  uploadfilename을 주고
                    // sendmail에 req값으로 넣을때 같이 넣으면 받아올 수 있지 않을까..?

                    // 일단 아무 파일이나 넣어서 보내보자. 이렇게 해서 첨부파일이 보내지는게 맞는지 확인 필요.
                    // ', "path":"' + filePath + '1608264298884_google_logo.png" }'  
                    // 이렇게 해서 보내니까 보내진다.
                }
                else {
                    attachment += ', { "filename": "' + req.files[i].originalname + '"' + 
                    ', "path":"' + filePath + req.body.pUploadName[i] + '" }';
                }
            }
        }

        attachment += ']'

        console.log("attachment : " + attachment);

        // 일반 파일의 경우도 attachment를 추가해줘야 함

        // console.log(attachment);
        //console.log(dom);

        var emlData = {
            // 보통 From은 고정된다.... 쓸 필요가 없다 사실상
            from : '"유림정보시스템" <post@yurim-info.com>', // sender address
            to : req.body.pTo, // list of receivers
            cc : req.body.pCc,
            subject : req.body.pSubject, // Subject line
            //text: "Hello world?", // plain text body
            html : dom.window.document.documentElement.outerHTML, // html body
            attachments : JSON.parse(attachment)
        }

        let info = await transporter.sendMail(emlData);

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.json({result : 'success'});
    } 
    catch(err) {
        console.log(err);
        res.json({result : 'err'});
    }
});

router.get('/saveEML', async function(req, res, next) {
    try {
        // let testAccount = await nodemailer.createTestAccount();

        let filePath = path.join(__dirname, '..','/public/attach/');

        let transporter = nodemailer.createTransport({
            host: "smtp.daum.net",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "yuriminfo", // generated ethereal user
                pass: "dbfla1212))", // generated ethereal password
            },
            // path가 있는데 무슨옵션인지 모르겠음...
            // path: filePath,
            // sendmail: true
        });

        // 메일 보내고 메일 정보까지 가지고 오나 현재 해당 내용이 메일에 들어오지 않음
        // 메일 주소 뒤에 , 붙여야 사용가능
        // 없으면 보내지 않음
        // 몇번 보내고 난 후 451 에러 발생 -> 메일 잘못된 경우 발생
        // '451 Unable to queue message (b)'

        // File Attachment 후 메일이 오지 않음
        // 메일은 정상적으로 보내졌다고 함
        // Data로 하면 안됨
        // 구글은 파일 첨부가 되면 데이터를 못받고
        // 다음은 받음 -> Data도 받음

        // 구글에 파일첨부가 안되는 현상 발생 -> 스팸에 들어가 있었음
        // nodemailer 는 첨부파일로 cid를 넣는거라 구글에는 보내지지 않음....
        // 보내는건 차라리 서버 프로그램이 나을수도 있겠다....(C#)
        // 구글에서는 첨부파일로 안보이는데
        // 다음에서는 첨부파일로 보여짐


        //  console.log(filePath + 'MES 업체별 메뉴정리(최종).xlsx');

        var emlData = {
            from: '"유림정보시스템" <post@yurim-info.com>', // sender address
            to: "yr.us.kim2@gmail.com, post@yurim-info.com", // list of receivers
            subject: "Mail Send", // Subject line
            text: "Hello world?", // plain text body
            html: '<b>메일테스트 입니다</b><img src="cid:unique@kreata.ee">', // html body
            attachments:[
                {
                    filename: 'test.png',
                    path: 'data:image/png;base64,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',
                    cid: 'unique@kreata.ee'
                }
            ]
        };

        let info = await transporter.sendMail(emlData);


        // // 포맷이 조금 다름...
        // from: '"유림정보시스템" <post@yurim-info.com>', // sender address
        // to: "yr.us.kim2@gmail.com"  , //post@yurim-info.com", // list of receivers
        // subject: "Mail Send", // Subject line
        // text: "Hello world?", // plain text body
        // html: '<b>메일테스트 입니다</b><img src="cid:unique@kreata.ee">', // html body
        var data = {
            from: "post@yurim-info.com",
            to: [
                {email: "yr.us.kim2@gmail.com"},
                {email: "post@yurim-info.com" }
            ],
            subject: "Mail Send",
            // text: "Hello world?",
            html: '<b>메일테스트 입니다</b><img src="test.png">',
            date: '2020-12-15 19:08:25',
            // 저장된 파일로만 가능한지?
            // data Type으로 받은 내용은 처리가 되지 않음
            // byte로만 가져올 수 있는 무언가가 필요해 보임

            // 아니면 보내는 파일을 저장하고 보내는것도 괜찮을 듯
            // 보내고 삭제해버리면 되니
            attachments:[
                {
                    name: 'test.png',
                    contentType : 'image/png',
                    data: fs.readFileSync("nodejs.png"),
                    inline : true
                },
                {
                    name: 'test.png',
                    contentType : 'image/png',
                    data: fs.readFileSync("nodejs.png")
                }
            ]
        };
           
        emlformat.build(data, function(error, eml) {

            if (error) {
                console.log(error);
                //return; 
            } else {
                //console.log(error);
                fs.writeFileSync("build.eml", eml);
                console.log("Done!");
            }
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.json({result : 'success'});

    } catch(err) {
        console.log(err);

        res.json({result : 'err'});
    }
});

module.exports = router;