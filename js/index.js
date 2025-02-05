'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const main = document.querySelector('.mainImage'),
        images = main.querySelectorAll('.mainImage .slider img'),
        animatedText = main.querySelector('.mainImage .animated-text'),
        animatedTextLink = main.querySelector('.mainImage .animated-text-link');
    let currentIndex = 0, isTransitioning = false; // 플래그 변수로 이벤트 처리 중 상태를 관리

    //DOMContentLoaded는 JavaScript에서 사용하는 이벤트(Event) 이름으로, 
// 웹 페이지의 HTML이 완전히 로드되고 DOM이 생성되었을 때 실행되는 이벤트

    // 텍스트 업데이트 함수
    function updateText(index) {
        const text = images[index]?.dataset.text || ""; // 현재 이미지의 data-text 가져오기
        const link = images[index]?.parentNode.href || "#"; // 현재 이미지의 부모 링크 가져오기
        animatedTextLink.href = link; // 텍스트 링크를 이미지 링크로 설정
        animatedText.classList.remove('visible'); // 기존 텍스트 숨기기

        setTimeout(() => {
            // 새로운 텍스트 설정 후 나타나게 하기
            animatedText.innerHTML = text;
            animatedText.classList.add('visible');
        }, 1000); // 텍스트 숨김 상태 유지 시간 (1)초초
    }

    // 이미지 전환 함수
    function changeImage(direction) {

        if (isTransitioning) return;
        isTransitioning = true;
        // 현재 이미지를 숨기기
        images[currentIndex].classList.remove('visible');

        // 인덱스 변경
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = images.length - 1;
        if (currentIndex >= images.length) currentIndex = 0;

        // 새 이미지를 보이기
        images[currentIndex].classList.add('visible');

        updateText(currentIndex);

        // 0.8초 후 이벤트 처리 가능 상태로 플래그 해제 (CSS transition 시간과 동일하게 설정)
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }



    // 초기 설정: 첫 번째 이미지만 보이도록 설정
    images[currentIndex].classList.add('visible');
    setTimeout(() => updateText(currentIndex), 1000); // 페이지 로드 후 텍스트 표시시



    // 화살표 클릭 이벤트
    main.querySelector('.wayleft').addEventListener('click', () => changeImage(-1));
    main.querySelector('.wayright').addEventListener('click', () => changeImage(1));



});