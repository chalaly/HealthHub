'use strict';

document.addEventListener("DOMContentLoaded", async function () {
    const userNameEl = document.getElementById("user-name");
    const userEmailEl = document.getElementById("user-email");
    const userNickEl = document.getElementById("nick-name");
    const currentPasswordInput = document.getElementById("current-password");
    const newPasswordInput = document.getElementById("new-password");  
    const confirmPasswordInput = document.getElementById("confirm-password");
    const savePasswordBtn = document.getElementById("save-password");
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
    savePasswordBtn.addEventListener("click", async function (event) {
        event.preventDefault();
        const currentPassword = currentPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // 필수 입력값 확인
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        //  새 비밀번호와 비밀번호 확인 값이 일치하는지 확인
        if (newPassword !== confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            //  서버에서 현재 사용자 정보 가져오기 (배열에서 찾기)
            const response = await axios.get("http://localhost:3000/clientData");
            const users = response.data;

            //  로그인한 사용자 정보 찾기
            const userData = users.find(user => user.clientId === loggedInUser.clientId);
            
            if (!userData) {
                alert("사용자 정보를 찾을 수 없습니다.");
                return;
            }

            //  현재 비밀번호 검증
            if (userData.clientPwd !== currentPassword) {
                alert("현재 비밀번호가 올바르지 않습니다.");
                return;
            }

            //  서버에 새 비밀번호 저장 (PUT 요청)
            //PUT 요청으로 기존 데이터를 업데이트할 때, 
            // 비밀번호 필드(clientPwd)가 무조건 새로운 값으로 덮어쓰기가 된다
            await axios.put(`http://localhost:3000/clientData/${userData.id}`, {
                ...userData,
                clientPwd: newPassword
            });

            //  localStorage에서도 비밀번호 변경
            loggedInUser.password = newPassword;
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

            alert("비밀번호가 변경되었습니다.");
            location.href = "../html/mypage.html"; // 마이페이지로 이동
        } catch (error) {
            console.error("비밀번호 변경 오류:", error);
            alert("비밀번호 변경에 실패했습니다.");
        }
    });

    //  취소 버튼 클릭 시 마이페이지로 이동
    cancelBtn.addEventListener("click", function () {
        window.location.href = "../html/mypage.html";
    });
});
