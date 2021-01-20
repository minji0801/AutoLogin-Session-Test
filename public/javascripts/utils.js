


function GetNowDateTime() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hour = String(today.getHours()).padStart(2, '0');
    var minute = String(today.getMinutes()).padStart(2, '0');

    return hour + ':' + minute;
}


var socket = io();

function SetChatList(B_IDs) {
    // inbox_chat
    // 우선 모든 내용 지우기
    $('#inbox_chat').empty();

    $.ajax({
        type: 'POST',
        url: '/api/chat_list',
        data:  {pB_IDs:B_IDs},
        //  + '?page=' + pages + '&rowCount=' + rowcounts,
        dataType: "json"
        ,success: function(response) {
            for(i=0; i<response.data.length; i++) {
                SetChatListElement(response.data[i].CR_Name, response.data[i].CRD_Message, response.data[i].CR_IDs, B_IDs);
            }
        }
    });

    // <div class="chat_list">
    //     <div class="chat_people">
    //     <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
    //     <div class="chat_ib">
    //         <h5>Sunil Rajput <span class="chat_date">Dec 25</span></h5>
    //         <p>Test, which is a new approach to have all solutions 
    //         astrology under one roof.</p>
    //     </div>
    //     </div>
    // </div>
}

function SetChatListElement(title, message, cr_IDs, b_IDs) {

    if(message == null) {
        message = '';
    } else {}

    $('#inbox_chat').append(
        '<a onclick="SetChatDetail(\'' + cr_IDs + '\', \'' + b_IDs +'\')" style="display:block; cursor:pointer">' +
        '   <div id="' + cr_IDs +'" class="chat_list">' +
        '       <div class="chat_people">' +
        '           <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>' +
        '           <div class="chat_ib">' +
        '               <h5>' + title + ' <span class="chat_date"></span></h5>' +
        '               <p id="' + cr_IDs + 'p' + '">' + message +'</p>' +
        '               <div id="' + cr_IDs + 'd' + '"class="none_display">New</div>' +
        '           </div>' +
    '           </div>' +
            '</div>' +
        '</a>'
    );
}

function SendMessage() {

    // 예외처리 추가 해야 함
    // 채팅방 선택된것이 없을때는 아예 보내지 말아야 함

    if($.trim($('#write_msg').val()) != '') {
        console.log($.trim($('#write_msg').val()));

        var sendMessage = $("#write_msg").val();

        sendMessage = sendMessage.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        sendMessage = sendMessage.replace(/'/g,'\'\'');
        
        socket.emit("Message", {
            B_IDs: sessionStorage.getItem("_B_IDs"),
            CR_IDs : sessionStorage.getItem("_CR_IDs"),
            message : sendMessage
        });

        onSend(sendMessage, "message", '');
        // $('#msg_history').scrollTop( $('#msg_history').height() );
    } else {}

    return false;
    
}

function onSend(message, type, fileName) {
    // 선택한 방이 있으면 처리
    // 없으면 방 선택하라고 알리기

    message = decodeHTMLEntities(message).replace(/''/g,'\'');

    if(sessionStorage.getItem("_CR_IDs") != '') {

        if(type == 'file') {

            $('#msg_history').append(
                '<div class="outgoing_msg">' +
                '   <div class="sent_msg">' + 
                '       <a href="/upload/' + fileName + '" download="' + message + '">' +
                '           <p>' + message + '</p>' +
                '       </a>' +
            '           <span class="time_date"> '+ GetNowDateTime() +' |    Today</span>' + 
                '   </div>' +
                '</div>'
            );
        } else {

            $('#msg_history').append(
                '<div class="outgoing_msg">' +
                '    <div class="sent_msg">' + 
                '       <p>' + message + '</p>' +
                '       <span class="time_date"> '+ GetNowDateTime() +' |    Today</span>' + 
                '    </div>' +
                '</div>'
            );
        }




        $('#write_msg').val('');
        // msg_history
        $("#msg_history").scrollTop($("#msg_history")[0].scrollHeight);

        UpdateChatList(message, sessionStorage.getItem("_CR_IDs"));
    } 
    else{
        alert("채팅방을 선택해주세요.");
    }
}

function onReceive(message, CR_IDs, name) {
    // 자신이 지금 보고 있는 방이면 처리
    // 아니면 다른거 처리

    message = decodeHTMLEntities(message).replace(/''/g,'\'');

    if(CR_IDs == sessionStorage.getItem("_CR_IDs")) {
        $('#msg_history').append(
            '<div class="incoming_msg">' +
            '    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>' +
            '    <div class="received_msg">' +
            '    <div class="received_withd_msg">' +
            '        <p>' + message + '</p>' +
            '        <span class="time_date">'+ GetNowDateTime() +' | Today | ' + name+ '</span></div>' +
            '    </div>' +
            '</div>'
        );

        $("#msg_history").scrollTop($("#msg_history")[0].scrollHeight);
    } else {}
    
    // 채팅방 정보 변경
    UpdateChatList(message, CR_IDs);
}

function onReceiveFile(message, CR_IDs, name, fileName) {
    // 자신이 지금 보고 있는 방이면 처리
    // 아니면 다른거 처리

    message = decodeHTMLEntities(message).replace(/''/g,'\'');

    if(CR_IDs == sessionStorage.getItem("_CR_IDs")) {
        $('#msg_history').append(
                '<div class="incoming_msg">' +
                '    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>' +
                '    <div class="received_msg">' +
                '       <div class="received_withd_msg">' +
                '           <a href="/upload/' + fileName + '" download="' + message + '">' +
                '               <p>' + message + '</p>' +
                '           </a>' + 
            '               <span class="time_date">'+ GetNowDateTime() +' | Today | ' + name+ '</span>' + 
                '       </div>' +
                '    </div>' +
                '</div>'
        );

        $("#msg_history").scrollTop($("#msg_history")[0].scrollHeight);
    } else {}
    
    // 채팅방 정보 변경
    UpdateChatList(message, CR_IDs);
}

function UpdateChatList(message, CR_IDs) {
    
    $('#' + CR_IDs + 'p').empty();

    // message = message.replaceAll('<br/>', ' ');

    $('#' + CR_IDs + 'p').append(message);

    if(sessionStorage.getItem("_CR_IDs") != CR_IDs) {
        // ?? Remove Class 하는데 애가 아예 사라짐 (P안에 Span인경우)
        //$('#' + CR_IDs + 'd').append('<div class="display">New</div>');
        $('#' + CR_IDs + 'd').removeClass('none_display');
        $('#' + CR_IDs + 'd').addClass('display');

        var audio = document.getElementById("myAudio");
        audio.play();
    } else {}
}

function SetChatDetail(CR_IDs, B_IDs) {
    $('#' + sessionStorage.getItem("_CR_IDs")).removeClass('active_chat');

    // ?? Remove Class 하는데 애가 아예 사라짐 (P안에 Span인경우)
    $('#' + CR_IDs + 'd').removeClass('display');
    $('#' + CR_IDs + 'd').addClass('none_display');

    sessionStorage.setItem("_CR_IDs", CR_IDs);

    // _CR_IDs = CR_IDs;
    // 다른 DIV 찾아서 없앨 것
    // 현재 하는건 꼼수처럼 보여짐...
    $('#' + CR_IDs).addClass('active_chat');

    $('#msg_history').empty();

    $.ajax({
        type: 'POST',
        url: '/api/chat_details',
        data:  {pCR_IDs:CR_IDs},
        //  + '?page=' + pages + '&rowCount=' + rowcounts,
        dataType: "json"
        ,success: function(response) {
            //console.log(response);

            for(i=0; i<response.data.length; i++) {
                SetChatDetailElement(
                    response.data[i].CRD_B_IDs
                    , response.data[i].CRD_Message
                    , B_IDs
                    , response.data[i].CRD_Dt
                    , response.data[i].B_Name
                    , response.data[i].CRD_Type
                    , response.data[i].CRD_OriginalFileName
                );
            }

            $("#msg_history").scrollTop($("#msg_history")[0].scrollHeight);
        }
    });
}

function SetChatDetailElement(B_IDs, message, user_B_IDs, time, name, type, fileName) {

    // message = decodeHTMLEntities(message).replace(/''/g,'\'')

    if(B_IDs != user_B_IDs) {

        if(type == "message") {
            $('#msg_history').append(
                '<div class="incoming_msg">' +
                '    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>' +
                '    <div class="received_msg">' +
                '    <div class="received_withd_msg">' +
                '        <p>' + message + '</p>' +
                '        <span class="time_date">'+ time +' | Today | ' + name + '</span></div>' +
                '    </div>' +
                '</div>'
            );
        } else {
            $('#msg_history').append(
                    '<div class="incoming_msg">' +
                    '    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>' +
                    '    <div class="received_msg">' +
                    '       <div class="received_withd_msg">' +
                    '           <a href="/upload/' + fileName + '" download="' + message + '">' +
                    '               <p>' + message + '</p>' +
                    '           </a>' + 
                '               <span class="time_date">'+ time +' | Today | ' + name + '</span>' + 
                    '       </div>' +
                    '    </div>' +
                    '</div>'
            );
        }
    } else {
        if(type == "message") {
            $('#msg_history').append(
                '<div class="outgoing_msg">' +
                '    <div class="sent_msg">' + 
                '    <p>' + message + '</p>' +
                '    <span class="time_date"> '+ time +' | Today | </span> </div>' +
                '</div>'
            );
        } else {
            $('#msg_history').append(
                    '<div class="outgoing_msg">' +
                    '    <div class="sent_msg">' + 
                    '       <a href="/upload/' + fileName + '" download="' + message + '">' +
                    '           <p>' + message + '</p>' +
                    '       </a>' +
                '           <span class="time_date"> '+ time +' | Today | </span> '+
                    '    </div>' +
                    '</div>'
            );
        }
    }
}

function getCaret(el) { 
    if (el.selectionStart) { 
        return el.selectionStart; 
    } else if (document.selection) { 
        el.focus();
        var r = document.selection.createRange(); 
        if (r == null) { 
            return 0;
        }
        var re = el.createTextRange(), rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
    }  
    return 0; 
}

$("textarea#write_msg").keyup(function(e) {
	e.preventDefault();
	var code = e.keyCode ? e.keyCode : e.which;
	if (code == 13) // EnterKey
	{
		if (e.shiftKey === true)
		{
            // shift 키가 눌려진 상태에서는 new line 입력
            // br을 넣어줘야 하나?
            $(this).height(1).height( $(this).prop('scrollHeight')+12);

            var content = this.value;  
            var caret = getCaret(this);

            this.value = content.substring(0, caret - 1) + "\r\n" + content.substring(caret, content.length);
            event.stopPropagation();
		}
		else
		{
            $(this).height(48);
			$('#sendForm').submit();
		}

		return false;
	}
});

function decodeHTMLEntities(text) {
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['#34', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);
    return text;
}


$(function() {
    
    //var socket = io('http://192.168.0.135:3000', {transport : ['websocket']});
    if(sessionStorage.getItem("_B_IDs") == null || sessionStorage.getItem("_B_IDs") == '') {
        location.href = "/";
    } else {}

    // session storage 최대한 사용 자제
    socket.emit("Login", {
        B_Name : sessionStorage.getItem("_B_Name"),
        B_Login_ID : sessionStorage.getItem("_B_Login_ID"),
        B_IDs : sessionStorage.getItem("_B_IDs")
    });


    // sessionStorage.getItem("_B_IDs");
    // sessionStorage.getItem("_B_Login_ID");
    // sessionStorage.getItem("_B_Name");
    // sessionStorage.getItem("_CR_IDs");
    sessionStorage.setItem("_CR_IDs", "");

    SetChatList(sessionStorage.getItem("_B_IDs"));

    // socket.emit("connection", 'test');
        
    socket.on("Message_Res", function(data) {
        // $('#txtConsole').append(data);
        console.log("receive : " + data.writeName)

        onReceive(data.message, data.CR_IDs, data.writeName);
    });

    socket.on("Message_Res_file", function(data) {
        // $('#txtConsole').append(data);
        console.log("receive : " + data.writeName)

        onReceiveFile(data.message, data.CR_IDs, data.writeName, data.fileName);
    });

    fileDropDown();
    
});

/////////////////////////////////////////////////////////////////////


function fileDropDown(){
    var dropZone = $("#msg_history");
    //Drag기능 
    dropZone.on('dragenter',function(e){
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color','#E3F2FC');
    });
    dropZone.on('dragleave',function(e){
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color','#FFFFFF');
    });
    dropZone.on('dragover',function(e){
        e.stopPropagation();
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color','#E3F2FC');
    });
    dropZone.on('drop',function(e){
        e.preventDefault();
        // 드롭다운 영역 css
        dropZone.css('background-color','#FFFFFF');
        
        // files 로 가져오면 폴더도 같이 가져오게 됨
        // folder를 인식하는 방법 확인 필요
        // folder의 경우 type 값이 '' 로 들어오게 됨(빈칸)

        var files = e.originalEvent.dataTransfer.files;
        if(files != null){
            if(files.length < 1){
                //alert("폴더 업로드 불가");
                //return;
            } else {
                var formData = new FormData();

                for(var i=0; i<files.length; i++) {
                    // type 으로 확인할 것


                    // 해당 파일을 어떻게 Ajax로 보낼것인지....
                    if(files[i].type != "") {
                        formData.append('files', files[i]);

                        console.log('... file[' + i + '].name = ' + files[i].name + "... type : " + files[i].type);

                        // let today = new Date();   

                        // let year = today.getFullYear(); // 년도
                        // let month = today.getMonth() + 1;  // 월
                        // let date = today.getDate();  // 날짜
                        // let hour = today.getHours();  // 시
                        // let minute = today.getMinutes();  // 분
                        // let second = today.getSeconds();  // 초

                        // var fileName = files[i].name;

                        // //files[i].name = year + '' + month + '' + date + '' + hour + '' + minute + '' + second;

                        // console.log(files[i]);

                        console.log("Append Form");
                    } 
                    else {
                        alert("impossible folder upload");
                        return;
                    }
                }

                formData.append("B_IDs", sessionStorage.getItem("_B_IDs"));
                formData.append("CR_IDs", sessionStorage.getItem("_CR_IDs"));
                // B_IDs: 
                // CR_IDs : sessionStorage.getItem("_CR_IDs"),

                $.ajax({
                    url: '/api/fileUpload',
                    type: 'post',
                    data: formData,
                    //enctype:'multipart/form-data',
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    cache:false,
                    success: function(response){
                        //addThumbnail(response);

                        for(var i=0; i<response.files.length; i++) {
                            socket.emit("File", {
                                B_IDs: sessionStorage.getItem("_B_IDs"),
                                CR_IDs : sessionStorage.getItem("_CR_IDs"),
                                message : response.files[i].originalName,
                                fileName : response.files[i].fileName
                            });
                    
                            onSend(response.files[i].originalName, "file", response.files[i].fileName );
                        }
                    }
                });
            }
            //selectFile(files)
        } else {
            alert("ERROR");
        }
    });
}