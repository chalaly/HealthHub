'use strict'

// 페이지가 완전히 로드되었을 때 실행
// 리뷰 및 사용자 데이터를 가져오고, 테이블을 렌더링함
document.addEventListener("DOMContentLoaded", function () {

    let reviews = []; // 리뷰 데이터를 저장할 배열
    let users = []; // 사용자 데이터를 저장할 배열
    let machines = [];
    let questions = [];
    updateHeader(); //  페이지 로드 시 로그인 상태 업데이트 실행

    //  로그인 상태 업데이트 함수
    function updateHeader() {
        const dropdownBox = document.querySelector(".dropdown_box");
        if (!dropdownBox) {
            if (attempts > 0) {
                console.warn(`헤더가 아직 로드되지 않음`);
            }
            return;
        }

        const storedUser = localStorage.getItem("loggedInUser");
        const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
        
        if (loggedInUser) {
            dropdownBox.innerHTML = `
            <a href="#" id="logoutBtn" class="dropdown_link">로그아웃</a>
            `;

            document.querySelector(".dropdown_link").addEventListener("click", function (event) {
                event.preventDefault();
                localStorage.removeItem("loggedInUser");
                alert("로그아웃되었습니다.");
                window.location.href = "../index.html"
            });
        }
    }

    //  뒤로 가기 했을 때도 로그인 상태 업데이트 (캐시 문제 해결)
    window.addEventListener("pageshow", function () {
        updateHeader();
    });

    // 평균 평점 및 총 리뷰 개수를 화면에 업데이트하는 함수
    function updateStats() {
        document.getElementById("averageRating").textContent = calculateAverageRating();
        document.getElementById("totalReviews").textContent = reviews.length;
    }

    // 서버에서 Q&A 데이터를 비동기적으로 가져오는 함수
    async function fetchQuestions() {
        try {
            const response = await axios.get('http://localhost:3000/questions');
            questions = response.data; // 데이터 저장
            renderQuestions();
        } catch (error) {
            console.error("qna 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    // 서버에서 머신 데이터를 비동기적으로 가져오는 함수
    async function fetchMachines() {
        try {
            const response = await axios.get('http://localhost:3000/machines');
            machines = response.data; // 데이터 저장
        } catch (error) {
            console.error("머신 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    // 서버에서 리뷰 데이터를 비동기적으로 가져오는 함수
    async function fetchReviews() {
        try {
            await fetchMachines();
            const reviewsResponse = await axios.get('http://localhost:3000/reviews');
            reviews = reviewsResponse.data;
            renderReviews(); // 가져온 데이터를 화면에 반영
        } catch (error) {
            console.error("리뷰 및 머신 데이터를 가져오는 중 오류 발생:", error);
        }
    }

    // 서버에서 사용자 데이터를 비동기적으로 가져오는 함수
    async function fetchUsers() {
        try {
            const response = await axios.get('http://localhost:3000/clientData');
            users = response.data.filter(user => user.clientName !== "admin");
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

    // 답변 저장 함수
    async function updateAnswer(id, answer) {
        try {
            await axios.patch(`http://localhost:3000/questions/${id}`, { answer });
            fetchQuestions(); // 업데이트 후 다시 불러오기
        } catch (error) {
            console.error("답변 저장 중 오류 발생:", error);
        }
    }

    // 질문 삭제 함수
    async function deleteQuestion(id) {
        try {
            await axios.delete(`http://localhost:3000/questions/${id}`);
            fetchQuestions(); // 삭제 후 다시 불러오기
        } catch (error) {
            console.error("질문 삭제 중 오류 발생:", error);
        }
    }
    console.log(fetchQuestions);


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
            const machine = machines.find(machine => machine.pageId === review.pageId);
            const machineName = machine ? machine.machineName : "알 수 없음"; // 매칭되는 기구 없으면 기본값
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${review.nickname}</td>
            <td>${review.rating}</td>
            <td>${machineName}</td>
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

    // Q&A 데이터를 테이블에 렌더링하는 함수
    function renderQuestions() {
        const questionTableBody = document.getElementById("questionTableBody");
        questionTableBody.innerHTML = ""; // 기존 테이블 초기화

        questions.forEach(question => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${question.author}</td>
            <td>${question.title} : ${question.content}</td>
            <td>
            <textarea data-id="${question.id}" class="answerInput">${question.answer || ''}</textarea>
            </td>
            <td>
            <button class="saveAnswer" data-id="${question.id}">저장</button>
            <button class="deleteQuestion" data-id="${question.id}">삭제</button>
            </td>
            `;

            row.querySelector(".saveAnswer").addEventListener("click", () => {
                const answerInput = row.querySelector(".answerInput").value;
                updateAnswer(question.id, answerInput);
            });

            row.querySelector(".deleteQuestion").addEventListener("click", () => {
                deleteQuestion(question.id);
            });

            questionTableBody.appendChild(row);
        });
    }

    // 페이지 로드 시 리뷰 및 사용자 데이터를 가져오는 함수 실행
    fetchReviews();
    fetchUsers();
    fetchQuestions(); // 페이지 로드 시 Q&A 데이터 불러오기

    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.pushState(null, null, location.href);
    };
});
