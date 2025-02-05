'use strict';
document.addEventListener("DOMContentLoaded", function () {
    updateHeader(); //  페이지 로드 시 로그인 상태 업데이트 실행

    //  로그인 상태 업데이트 함수
    function updateHeader() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const dropdownBox = document.querySelector(".dropdown_box");

        if (!dropdownBox) {
            console.warn("헤더가 아직 로드되지 않았습니다. 다시 실행을 대기합니다.");
            return;
        }

        if (loggedInUser) {
            dropdownBox.innerHTML = `
                <a href="../html/about.html" class="dropdown_link">소개</a>
                <a href="../html/mypage.html" class="dropdown_link">마이페이지</a>
                <a href="#" id="logoutBtn" class="dropdown_link">로그아웃</a>
            `;

            document.getElementById("logoutBtn").addEventListener("click", function (event) {
                event.preventDefault();
                localStorage.removeItem("loggedInUser");
                alert("로그아웃되었습니다.");
                location.reload(); // 새로고침하여 변경 적용
                location.href = '../index.html';
            });
        } else {
            dropdownBox.innerHTML = `
                <a href="../html/about.html" class="dropdown_link">소개</a>
                <a href="../html/mypage.html" class="dropdown_link">마이페이지</a>
                <a href="../html/login.html" class="dropdown_link">로그인</a>
            `;
        }
    }

    //  뒤로 가기 했을 때도 로그인 상태 업데이트 (캐시 문제 해결)
    window.addEventListener("pageshow", function () {
        updateHeader();
    });
});
