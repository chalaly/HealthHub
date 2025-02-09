'use strict';

document.addEventListener("DOMContentLoaded", async function () {
    const userNameEl = document.getElementById("user-name");
    const userEmailEl = document.getElementById("user-email");
    const userNickEl = document.getElementById("nick-name");   
    const newNickInput = document.getElementById("new-nick");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const editNickBtn = document.getElementById("edit-nick");
    const cancelBtn = document.getElementById("cancel");

    //  로그인한 사용자 정보 가져오기
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    

    if (!loggedInUser) {
        alert("로그인이 필요합니다.");
        window.location.href = "../html/login.html"; // 로그인 페이지로 리디렉트
        return;
    }

    userNameEl.textContent = loggedInUser.clientName;
    userEmailEl.textContent = loggedInUser.clientId;
    userNickEl.textContent = loggedInUser.clientNick;

    //  비밀번호 변경 버튼 클릭 시 실행
    editNickBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        
        const newNick = newNickInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        //  필수 입력값 확인
        if (!newNick || !confirmPassword) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        try {
            //  서버에서 사용자 데이터 가져오기
            const response = await axios.get("http://localhost:3000/clientData");
            const users = response.data;

            //  현재 로그인한 사용자 정보 찾기
            const userData = users.find(user => user.clientId === loggedInUser.clientId);

            if (!userData) {
                alert("사용자 정보를 찾을 수 없습니다.");
                return;
            }

            if (users.some(user => user.clientNick === newNick.trim())) {
                alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 사용해주세요.");
                return;
            }


            //  비밀번호 확인
            if (userData.clientPwd !== confirmPassword) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }

            //  서버에 닉네임 업데이트 요청
            const updatedUserData = { ...userData, clientNick: newNick };

            const updateResponse = await axios.put(`http://localhost:3000/clientData/${userData.id}`, updatedUserData);

            if (updateResponse.status === 200) {
                alert("닉네임이 성공적으로 변경되었습니다!");

                //  localStorage 업데이트
                loggedInUser.clientNick = newNick;
                localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

                //  화면 업데이트
                userNickEl.textContent = newNick;
                newNickInput.value = "";
                confirmPasswordInput.value = "";
            } else {
                alert("닉네임 변경에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("서버 요청 중 오류 발생:", error);
            alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
    });

        
    //  취소 버튼 클릭 시 마이페이지로 이동
    cancelBtn.addEventListener("click", function () {
        window.location.href = "../html/mypage.html";
    });
});
