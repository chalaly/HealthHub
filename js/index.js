'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.mainImage'),
        images = main.querySelectorAll('.mainImage .slider img'),
        animatedText = main.querySelector('.mainImage .animated-text'),
        animatedTextLink = main.querySelector('.mainImage .animated-text-link');

    let currentIndex = 0, isTransitioning = false;
    let textUpdateTimeout; // 텍스트 업데이트 타이머 저장 변수

    // 텍스트 업데이트 함수
    function updateText(index) {
        clearTimeout(textUpdateTimeout); // 이전 타이머 제거
        animatedText.classList.remove('visible'); // 기존 텍스트 즉시 숨김

        textUpdateTimeout = setTimeout(() => {
            const text = images[index]?.dataset.text || "";
            const link = images[index]?.parentNode.href || "#";
            animatedTextLink.href = link;
            animatedText.innerHTML = text;
            animatedText.classList.add('visible'); // 새로운 텍스트 표시
        }, 800); // 이미지 변경 완료 후 텍스트 표시
    }

    // 이미지 전환 함수
    function changeImage(direction) {
        if (isTransitioning) return;
        isTransitioning = true;

        //  기존 텍스트를 먼저 숨김 (이미지 변경 전에 사라지도록)
        animatedText.classList.remove('visible');

        //  현재 이미지 숨기기
        images[currentIndex].classList.remove('visible');

        // 인덱스 변경
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = images.length - 1;
        if (currentIndex >= images.length) currentIndex = 0;

        // 새로운 이미지 보이기
        images[currentIndex].classList.add('visible');

        // 텍스트 업데이트
        updateText(currentIndex);

        //  0.8초 후 이벤트 처리 가능 상태로 플래그 해제
        setTimeout(() => {
            isTransitioning = false;
        }, 1500);
    }

    // 초기 설정: 첫 번째 이미지만 보이도록 설정
    images[currentIndex].classList.add('visible');
    updateText(currentIndex);

    // 화살표 클릭 이벤트
    main.querySelector('.wayleft').addEventListener('click', () => changeImage(-1));
    main.querySelector('.wayright').addEventListener('click', () => changeImage(1));
});
