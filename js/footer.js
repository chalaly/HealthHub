'use strict';

document.addEventListener("DOMContentLoaded", function () {
    console.log("footer.js 실행됨!"); // 디버깅용 로그

    const footer = document.getElementById("footer-container");
    if (!footer) {
        console.error("푸터 요소를 찾을 수 없습니다! HTML에 <footer id='footer-container'></footer>가 있는지 확인하세요.");
        return;
    }

    console.log("푸터 요소 찾음! HTML에 추가합니다.");

    // 푸터 콘텐츠 동적 삽입
    footer.innerHTML = `
        <div class="footer-content">
            <div class="logo-text">
                <img src="../img/logo.png" alt="밑밑 로고" class="footer_logo">
                <div class="text">
                    <p>인천 광역시 테크노파크22길 7-22 (리리)</p>
                    <p>대표전화: 032-111-1111 | 팩스번호: 022-222-2222</p>
                    <p>© 2025 Health Hub. All rights reserved.</p>
                </div>
            </div>
        </div>
    `;

    console.log("푸터 내용 삽입 완료!");

    // 초기 푸터 위치 조정 후 표시
    adjustFooterPosition();

    function adjustFooterPosition() {
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;

        if (docHeight <= winHeight) {
            document.body.classList.remove("has-scroll");
            footer.style.position = "absolute";
            footer.style.bottom = "0";
            footer.style.left = "0";
            footer.style.width = "100%";
        } else {
            document.body.classList.add("has-scroll");
            footer.style.position = "relative";
        }
    }

    // 창 크기 변경 시 푸터 위치 다시 확인
    window.addEventListener("resize", adjustFooterPosition);

    // MutationObserver로 DOM 변화 감지하여 푸터 위치 조정
    const observer = new MutationObserver(() => {
        adjustFooterPosition();
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // 스크롤 이벤트 발생 시 푸터 위치 조정
    window.addEventListener("scroll", adjustFooterPosition);
});
