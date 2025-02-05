'use strict'

// 페이지가 완전히 로드되었을 때 실행
// 리뷰 및 사용자 데이터를 가져오고, 테이블을 렌더링함
document.addEventListener("DOMContentLoaded", () => {
    let reviews = []; // 리뷰 데이터를 저장할 배열
    let users = []; // 사용자 데이터를 저장할 배열

    // 평균 평점 및 총 리뷰 개수를 화면에 업데이트하는 함수
    function updateStats() {
        document.getElementById("averageRating").textContent = calculateAverageRating();
        document.getElementById("totalReviews").textContent = reviews.length;
    }

    // 서버에서 리뷰 데이터를 비동기적으로 가져오는 함수
    async function fetchReviews() {
        try {
            const reviewsResponse = await axios.get("http://localhost:3000/reviews");
            reviews = reviewsResponse.data;
            renderReviews(); // 가져온 데이터를 화면에 반영
        } catch (error) {
            console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    // 서버에서 사용자 데이터를 비동기적으로 가져오는 함수
    async function fetchUsers() {
        try {
            const response = await axios.get("http://localhost:3000/clientData");
            users = response.data;
            users = response.data.filter(user => user.clientName !== admin);
            renderUsers(); // 가져온 데이터를 화면에 반영
        } catch (error) {
            console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    // 특정 리뷰를 삭제하는 함수
    async function deleteReview(id) {
        try {
            await axios.delete(`http://localhost:3000/reviews/${id}`);
            reviews = reviews.filter(review => review.id !== id); // 배열에서 해당 리뷰 제거
            renderReviews(); // 변경 사항을 화면에 반영
        } catch (error) {
            console.error("리뷰 삭제 중 오류 발생:", error);
        }
    }

    // 특정 사용자를 강제 탈퇴시키는 함수
    async function deleteUser(id) {
        try {
            await axios.delete(`http://localhost:3000/clientData/${id}`);
            users = users.filter(user => user.id !== id); // 배열에서 해당 사용자 제거
            renderUsers(); // 변경 사항을 화면에 반영
        } catch (error) {
            console.error("사용자 강제 탈퇴 중 오류 발생:", error);
        }
    }

    // 특정 사용자를 차단하는 함수
    async function banUser(id) {
        try {
            await axios.patch(`http://localhost:3000/clientData/${id}`, { banned: true });
            users = users.map(user => user.id === id ? { ...user, banned: true } : user); // 해당 사용자 차단 상태 변경
            renderUsers(); // 변경 사항을 화면에 반영
        } catch (error) {
            console.error("사용자 차단 중 오류 발생:", error);
        }
    }

    // 특정 사용자의 차단을 해제하는 함수
    async function unbanUser(id) {
        try {
            await axios.patch(`http://localhost:3000/clientData/${id}`, { banned: false });
            users = users.map(user => user.id === id ? { ...user, banned: false } : user); // 해당 사용자 차단 해제
            renderUsers(); // 변경 사항을 화면에 반영
        } catch (error) {
            console.error("사용자 차단 해제 중 오류 발생:", error);
        }
    }

    // 평균 평점을 계산하는 함수
    function calculateAverageRating() {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0); // 전체 평점 합산 후 평균 계산
        return parseFloat((total / reviews.length).toFixed(1)); // 소수점 첫째 자리까지 표시
    }

    // 리뷰 데이터를 테이블에 렌더링하는 함수
    function renderReviews() {
        const reviewTableBody = document.getElementById("reviewTableBody");
        reviewTableBody.innerHTML = ""; // 기존 테이블 데이터 초기화
        reviews.forEach(review => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${review.nickname}</td>
                <td>${review.rating}</td>
                <td>${review.pageId}</td>
                <td>${review.review}</td>
                <td>
                    <button type="button" class="delete">삭제</button>
                </td>
            `;
            row.querySelector(".delete").addEventListener("click", () => deleteReview(review.id)); // 삭제 버튼 이벤트 추가
            reviewTableBody.appendChild(row);
        });
        updateStats(); // 통계 업데이트
    }

    // 사용자 데이터를 테이블에 렌더링하는 함수
    function renderUsers() {
        const userTableBody = document.getElementById("userTableBody");
        userTableBody.innerHTML = ""; // 기존 테이블 데이터 초기화
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.clientName}</td>
                <td>${user.banned ? "차단됨" : "활성"}</td>
                <td>
                    <button type="button" class="ban-toggle ${user.banned ? 'banned' : 'active'}">
                    ${user.banned ? "해제" : "차단"}</button>
                    <button type="button" class="delete">강제탈퇴</button>
                </td>
            `;
            const banButton = row.querySelector(".ban-toggle");
            banButton.addEventListener("click", () => {
                user.banned ? unbanUser(user.id) : banUser(user.id); // 차단 상태 변경 이벤트 추가
            });
            row.querySelector(".delete").addEventListener("click", () => deleteUser(user.id)); // 강제 탈퇴 이벤트 추가
            userTableBody.appendChild(row);
        });
    }

    // 페이지 로드 시 리뷰 및 사용자 데이터를 가져오는 함수 실행
    fetchReviews();
    fetchUsers();
});
