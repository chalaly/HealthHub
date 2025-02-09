'use strict';

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm"),
         nameInput = signupForm.querySelector("#nameInput"),
        emailInput = signupForm.querySelector("#emailInput"),
        nicknameInput = signupForm.querySelector("#nicknameInput"),
        passwordInput = signupForm.querySelector("#passwordInput"),
        confirmPasswordInput = signupForm.querySelector("#confirmPasswordInput");

      //비밀 번호 유효성 검사 최소 4자리 이상   
      const passwordRegex = /^.{4,}$/;

    //  폼의 submit 이벤트 리스너 추가
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // 기본 폼 제출 방지

        const enteredEmail = emailInput.value.trim();
        const enteredNickname = nicknameInput.value.trim();
        const enteredPassword = passwordInput.value.trim();
        const enteredConfirmPassword = confirmPasswordInput.value.trim();

        if (!nameInput.value.trim() || !enteredEmail || !enteredPassword || !enteredNickname) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        if (!validateEmail(enteredEmail)) {
            alert("유효한 이메일 주소를 입력하세요.");
            return;
        }
        if (!passwordRegex.test(enteredPassword)) {
            alert("비밀번호는 최소 4자 이상 입니다.");
            return;
        }

        if (enteredPassword !== enteredConfirmPassword) {
            alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
            return;
        }

        const formData = new FormData(signupForm);
        

        try {
            // 1️ 서버에서 기존 사용자 데이터 가져오기
            const response = await axios.get('http://localhost:3000/clientData');
            const users = response.data;

            // 2️ 이메일(아이디) 중복 확인
            //some 메서드 사용 배열에서 특정 조건 만족하는 요소 하나라도 존재하는지 검사
            if (users.some(user => user.clientId === enteredEmail)) {
                alert("이미 사용 중인 이메일(아이디)입니다. 다른 이메일을 사용해주세요.");
                return;
            }

            // 3️ 닉네임 중복 확인
            if (users.some(user => user.clientNick === enteredNickname)) {
                alert("이미 사용 중인 닉네임입니다. 다른 닉네임을 사용해주세요.");
                return;
            }

            // 4️ 회원가입 요청 보내기 (banned 기본값 false)
            await axios.post('http://localhost:3000/clientData', {
                clientName: nameInput.value.trim(),
                clientId: enteredEmail,
                clientNick: enteredNickname,
                clientPwd: enteredPassword,
                banned: false // 기본값 false 설정
            });

            alert("회원가입이 완료되었습니다!");
            location.href = './login.html';
        } catch (err) {
            console.error('데이터 전송 중 오류 발생:', err.message);
            alert('데이터 전송에 실패했습니다. 다시 시도해주세요.');
        }
    });

    //  이메일 형식 검사 함수
    function validateEmail(email) {
        if (email === "admin") {

            return true; // "admin"은 이메일 형식 검사를 통과시킴
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
});
