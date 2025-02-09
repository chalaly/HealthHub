'use strict';

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm"),
        emailInput = loginForm.querySelector("#emailInput"),
        passwordInput = loginForm.querySelector("#passwordInput");

    //  폼의 submit 이벤트 리스너 추가
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 폼 제출 방지
        

        const enteredEmail = emailInput.value.trim();
        const enteredPassword = passwordInput.value.trim();

        if (!enteredEmail || !enteredPassword) {
            alert("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        // 관리자 로그인 처리
        if (enteredEmail && enteredPassword === "admin") {
            
            localStorage.setItem("loggedInUser", JSON.stringify({
                clientId: "admin",
                clientName: "admin",
                clientNick: "admin"
            }));
            
            window.location.href = './admin.html';
            return; // 이후 코드 실행 방지
        }

        // 일반 사용자 이메일 유효성 검사
        if (!validateEmail(enteredEmail)) {
            alert("유효한 이메일 주소를 입력하세요.");
            return;
        }

        try {
            // 1️ 서버에서 clientData 가져오기
            const response = await axios.get('http://localhost:3000/clientData');
            const users = response.data;

            // 2️ 사용자 검증
            const foundUser = users.find(user => user.clientId === enteredEmail && user.clientPwd === enteredPassword);

            if (foundUser) {

            // 차단된 사용자 확인인
                if (foundUser.banned === true) {
                    alert("해당 계정은 관리자에 의해 차단되었습니다. 로그인이 불가능합니다.");
                    return;
                }


                // 3️ 로그인 성공 → 메인 페이지로 이동
                alert("로그인 성공!");
                
                localStorage.setItem("loggedInUser", JSON.stringify({
                    clientId: foundUser.clientId,
                    clientName : foundUser.clientName,
                    clientNick: foundUser.clientNick // 사용자 이름 추가 가능

                }));


                location.href = '../index.html';
            } else {
                // 4️ 로그인 실패
                alert("로그인 실패! 이메일 또는 비밀번호가 일치하지 않습니다.");
            }
        } catch (err) {
            console.error('서버에서 데이터를 가져오는 중 오류 발생:', err.message);
            alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }
    });

    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
 });