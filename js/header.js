'use strict';
document.addEventListener("DOMContentLoaded", function () {
    updateHeader(); //  페이지 로드 시 로그인 상태 업데이트 실행

    const dropdownContainer = document.querySelector(".dropdown_container");
    const dropdownBox = document.querySelector(".dropdown_box");
    const iconCategory = document.querySelector(".icon_category");

    // 드롭다운 토글 기능
    iconCategory.addEventListener("click", function (event) {
        event.stopPropagation(); // 부모 요소로 이벤트 전파 방지
        dropdownBox.style.display = dropdownBox.style.display === "flex" ? "none" : "flex";
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener("click", function (event) {
        if (!dropdownContainer.contains(event.target)) {
            dropdownBox.style.display = "none";
        }
    });

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
                <a href="../html/qna.html" class="dropdown_link">Q&A</a>
                <a href="../html/search.html" class = "dropdown_link">검색</a>
                <a href="../html/introduce.html" class="dropdown_link">소개</a>
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
                <a href="../html/search.html" class = "dropdown_link">검색</a>
                <a href="../html/introduce.html" class="dropdown_link">소개</a>
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
