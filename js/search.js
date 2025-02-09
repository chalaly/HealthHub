'use strict';

document.addEventListener("DOMContentLoaded", async function () {
    const machineListEl = document.getElementById("machine-list");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const cancelButton = document.getElementById("cancel-button");

    let machines = [];  // 운동기구 목록
    let reviews = [];   // 리뷰 목록

    try {
        //  데이터베이스에서 운동기구 및 리뷰 데이터 가져오기
        const machinesResponse = await axios.get("http://localhost:3000/machines");
        const reviewsResponse = await axios.get("http://localhost:3000/reviews");

        machines = machinesResponse.data;
        reviews = reviewsResponse.data;

        console.log(" 운동기구 데이터:", machines);
        console.log(" 리뷰 데이터:", reviews);

        displayMachines(machines); //  초기 화면에 모든 운동기구 표시
    } catch (error) {
        console.error(" 데이터 로딩 오류:", error);
    }

    function getStarRating(score) {
        const fullStar = "../img/full-star.png";  // 가득 찬 별
        const halfStar = "../img/half-star.png";  // 반쪽 별
        const emptyStar = "../img/empty-star.png"; // 빈 별

        let starsHTML = "";
        let fullStars = Math.floor(score); // 정수 부분 (예: 3.6 → 3)
        let hasHalfStar = score % 1 >= 0.5; // 반쪽 별 여부 (예: 3.5 이상일 때 적용)

        //  가득 찬 별 추가
        for (let i = 0; i < fullStars; i++) {
            starsHTML += `<img src="${fullStar}" class="star">`;
        }

        //  반쪽 별 추가 (3.5 이상일 때 반쪽 별 이미지 적용)
        if (hasHalfStar && fullStars < 5) {
            starsHTML += `<img src="${halfStar}" class="star">`;
            fullStars++; // 반쪽 별도 포함
        }

        //  빈 별 추가 (최대 5개 유지)
        while (fullStars < 5) {
            starsHTML += `<img src="${emptyStar}" class="star">`;
            fullStars++;
        }

        return `
            <div class="star-rating">
                ${starsHTML} <span class="star-score">${score}점</span>
            </div>
        `;
    }

    /**
     * 운동기구 목록을 표시하는 함수 (카드뷰)
     */
    function displayMachines(machineList) {
        machineListEl.innerHTML = ""; // 기존 목록 초기화

        machineList.forEach(machine => {
            //  해당 운동기구의 평균 별점 계산
            const machineReviews = reviews.filter(review => review.pageId === machine.pageId);
            const averageRating = machineReviews.length > 0
                ? (machineReviews.reduce((sum, r) => sum + r.rating, 0) / machineReviews.length).toFixed(1)
                : "0.0";

            //  카드 요소 생성
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${machine.image}" alt="${machine.machineName}">
                <h3>${machine.machineName}</h3>
                <p>한줄평: <strong>${machine.message}</strong></p>
                ${getStarRating(averageRating)}
            `;

            card.addEventListener("click", () => {
                window.location.href = `../html/${machine.pageId}.html`;
            });

            machineListEl.appendChild(card);
        });
    }

    /**
     * 검색 버튼 클릭 시 필터링
     */
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query === "") {
            displayMachines(machines); //  검색어가 없으면 전체 목록 표시
            cancelButton.style.display = "none"; // 취소버튼 숨기기
        } else {
            const filteredMachines = machines.filter(machine =>
                machine.machineName.toLowerCase().includes(query)
            );
            displayMachines(filteredMachines);
            cancelButton.style.display = "inline-block"; //  취소 버튼 보이기
        }
    });

    /**
     * 검색 입력창에서 엔터 키 입력 시 검색 실행
     */
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            searchButton.click();
        }
    });

    //  취소 버튼 클릭 시 전체 목록 다시 표시
    cancelButton.addEventListener("click", () => {
        searchInput.value = ""; // 검색창 초기화
        displayMachines(machines); // 모든 운동기구 다시 표시
        cancelButton.style.display = "none"; // 취소 버튼 숨기기
    });

    //  검색 입력 시 취소 버튼 보이기
    searchInput.addEventListener("input", () => {
        if (searchInput.value.trim() === "") {
            cancelButton.style.display = "none"; // 검색어 없으면 숨김
        } else {
            cancelButton.style.display = "inline-block"; // 검색어 입력하면 보이기
        }
    });
});
