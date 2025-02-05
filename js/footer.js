'use strict';

document.addEventListener("DOMContentLoaded", function () {
    adjustFooterPosition(); //  페이지 로드 시 푸터 위치 조정 실행

    //  푸터 위치 조정 함수
    function adjustFooterPosition() {
        const footer = document.getElementById("footer-container");
        if (!footer) return;

        const bodyHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;
        const footerHeight = footer.offsetHeight;

        console.log(" Body height:", bodyHeight, "Window height:", windowHeight, "Footer height:", footerHeight);

        //  푸터가 화면 아래에 고정되어야 할지 여부 결정
        if (bodyHeight > windowHeight) {
            footer.style.position = "relative"; //  콘텐츠 아래 배치
        } else {
            footer.style.position = "absolute"; //  화면 하단에 고정
            footer.style.bottom = "0";
            footer.style.left = "0";
            footer.style.width = "100%";
        }
    }

    // 창 크기 변경 시 푸터 위치 다시 확인
    window.addEventListener("resize", adjustFooterPosition);
});
