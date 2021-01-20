

function Login() {
    $.ajax({
        type: 'POST',
        url: '/api/login',
        data:  {pId:$('#username').val(), pPwd:$('#password').val()},
        //  + '?page=' + pages + '&rowCount=' + rowcounts,
        dataType: "json"
        ,success: function(response) {

            console.log(response.result);
            console.log(response.data);

            if(response.result.indexOf("error") > -1) {
                alert("로그인 실패");
            } 
            else 
            {
                sessionStorage.setItem("_B_IDs", response.data[0].B_IDs);
                sessionStorage.setItem("_B_Login_ID", response.data[0].B_Login_ID);
                sessionStorage.setItem("_B_Name", response.data[0].B_Name);
                sessionStorage.setItem("_CR_IDs", '');
                // module._B_IDs = ;
                // module._B_Login_ID = response.data[0].B_Login_ID;
                // module._B_Name = response.data[0].B_Name;
                // module._CR_IDs = '';
                location.href = '/chat';
            }
        }
    });

    return false;

    // socket.emit("Login", {
    //     name: 'us.Kim',
    //     userid: "unseob2@gmail.com"
    // });
}