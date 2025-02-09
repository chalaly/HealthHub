'use strict';

let machines = [];

document.addEventListener("DOMContentLoaded", async function () {
    const userNameEl = document.getElementById("user-name");
    const userEmailEl = document.getElementById("user-email");
    const userNickEl = document.getElementById("nick-name");
    const activityListEl = document.getElementById("activity-list");
    const paginationEl = document.getElementById("pagination"); // 페이지네이션 컨테이너
    const editProfileBtn = document.getElementById("edit-profile-btn");
    const editNickBtn = document.getElementById("edit-nick-btn");

    let currentPage = 1; // 현재 페이지 번호
    const itemsPerPage = 5; // 한 페이지당 최대 리뷰 개수

    //  로컬 스토리지에서 로그인한 사용자 정보 가져오기
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log(loggedInUser);

    if (!loggedInUser) {
        alert("로그인이 필요합니다.");
        window.location.href = "../html/login.html"; // 로그인 페이지로 리디렉트
        return;
    }

    try {
        //  서버에서 사용자 데이터 및 리뷰 데이터 가져오기
        const response = await axios.get("http://localhost:3000/clientData");
        const reviewsResponse = await axios.get("http://localhost:3000/reviews");
        const machinesResponse = await axios.get("http://localhost:3000/machines");

        const users = response.data;
        const reviews = reviewsResponse.data;
        machines = machinesResponse.data;

        console.log(reviews);
        console.log(machines);

        //  로그인한 사용자 정보 찾기
        const user = users.find(user => user.clientId === loggedInUser.clientId);

        if (user) {
            userNameEl.textContent = user.clientName;
            userEmailEl.textContent = user.clientId; // 이메일 = 아이디
            userNickEl.textContent = user.clientNick;

            //  사용자가 작성한 리뷰만 필터링
            const userReviews = reviews.filter(review => review.clientId === user.clientId);
            console.log(" 사용자 리뷰 데이터:", userReviews);

            if (userReviews.length > 0) {
                displayReviews(userReviews, currentPage); //  페이지네이션 적용하여 리뷰 표시
            } else {
                activityListEl.innerHTML = "<p>작성한 리뷰가 없습니다.</p>";
            }
        } else {
            alert("사용자 정보를 불러오는 데 실패했습니다.");
        }
    } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
        alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }

    editProfileBtn.addEventListener("click", function () {
        location.href = "./editProfile.html";
    });

    editNickBtn.addEventListener("click", function () {
        location.href = "./editNick.html";
    });

    /**
     * 페이지네이션을 적용하여 리뷰를 표시하는 함수
     */
    function displayReviews(reviews, page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedReviews = reviews.slice(startIndex, endIndex);

        activityListEl.innerHTML = ""; // 기존 리스트 초기화

        paginatedReviews.forEach(review => {
            const machine = machines.find(m => m.pageId === review.pageId);
            const machineName = machine ? machine.machineName : "알 수 없음";

            const reviewItem = document.createElement("p");
            const reviewLink = document.createElement("a");
            reviewLink.href = `./${review.pageId}.html`;
            reviewLink.textContent = `(${machineName}) - " ${review.review}" (평점: ${review.rating}점)`;
            reviewLink.classList.add("review-link"); // css 스타일 적용 class 추가

            reviewItem.appendChild(reviewLink);
            activityListEl.appendChild(reviewItem);
        });

        updatePagination(reviews); // 페이지 버튼 업데이트
    }

    /**
     * 페이지네이션 버튼을 생성하는 함수
     */
    function updatePagination(reviews) {
        paginationEl.innerHTML = ""; // 기존 버튼 제거

        const totalPages = Math.ceil(reviews.length / itemsPerPage); // 총 페이지 수

        if (totalPages <= 1) return; // 페이지가 1개 이하이면 버튼을 만들 필요 없음

        // 이전 페이지 버튼
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "«";
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayReviews(reviews, currentPage);
            }
        });
        paginationEl.appendChild(prevBtn);

        // 페이지 번호 버튼
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.classList.add("page-btn");
            if (i === currentPage) pageBtn.classList.add("active");

            pageBtn.addEventListener("click", () => {
                currentPage = i;
                displayReviews(reviews, currentPage);
            });

            paginationEl.appendChild(pageBtn);
        }

        // 다음 페이지 버튼
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "»";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayReviews(reviews, currentPage);
            }
        });
        paginationEl.appendChild(nextBtn);
    }
});
