'use strict';

// 로그인 사용자 정보 불러오기 (중복 선언 방지)
if (!window.loggedInUser) {
    // 전역객체 저장
    window.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
}
let loggedInUser = window.loggedInUser;


// 리뷰 관련 요소 가져오기
const pageId = document.querySelector("main").id; // id로 가져오면 js전체 바꿔야함
const reviewsList = document.getElementById('reviews-list');
const averageRatingValue = document.getElementById('average-rating-value');
const reviewForm = document.getElementById('review-form');
const reviewText = document.getElementById('review-text');
const ratingSelect = document.getElementById('rating');
const submitButton = document.querySelector("#review-form button[type='submit']");



let ratings = []; // 기존 초기 평점 데이터


// 별 가져오는
function getStarRating(score) {
    const maxStars = 5; // 항상 별 5개 유지
    const fullStar = "../img/full-star.png";  // 가득 찬 별 이미지 경로
    const halfStar = "../img/half-star.png";  // 반쪽 별 이미지 경로
    const emptyStar = "../img/empty-star.png"; // 빈 별 이미지 경로

    let starsHTML = "";
    let fullStars = Math.floor(score); // 정수 부분 (예: 3.6 → 3)
    let hasHalfStar = score % 1 >= 0.5; // 반쪽 별 여부 (예: 3.5 이상일 때 적용)

    //  가득 찬 별 추가
    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<img src="${fullStar}" class="star">`;
    }

    //  반쪽 별 추가 (3.5 이상일 때 반쪽 별 이미지 적용)
    if (hasHalfStar && fullStars < maxStars) {
        starsHTML += `<img src="${halfStar}" class="star">`;
        fullStars++; // 반쪽 별도 포함
    }

    //  빈 별 추가 (최대 5개 유지)
    while (fullStars < maxStars) {
        starsHTML += `<img src="${emptyStar}" class="star">`;
        fullStars++;
    }

    return starsHTML;
}

// 평균 평점 계산 함수
function calculateAverageRating() {
    if (ratings.length === 0) return "0.0";
    const total = ratings.reduce((sum, item) => sum + item.rating, 0);
    return (total / ratings.length).toFixed(1); // 소수점 첫째 자리까지 표시
}

// 평균 평점 업데이트 함수
function updateAverageRating() {
    const average = calculateAverageRating(); // 평균 평점 계산

    averageRatingValue.textContent = average; // 숫자 표시
    document.getElementById("star-average-rating").innerHTML = getStarRating(average); // 별 UI 표시
}



// 페이지 로드 시 평균 평점 표시
updateAverageRating();

//  로그인되지 않은 사용자는 리뷰 폼을 비활성화
if (!loggedInUser || loggedInUser.clientId === "admin") {

    reviewText.disabled = true;  // 텍스트 입력 비활성화
    ratingSelect.disabled = true; // 평점 선택 비활성화
    submitButton.disabled = true; // 제출 버튼 비활성화
    reviewForm.style.opacity = '0.3';
    submitButton.style.pointerEvents = "none";
}



// HTML에서 기존 리뷰 가져오기
function loadExistingReviews() {
    const reviewElements = document.querySelectorAll("#reviews-list .review");
    const existingReviews = [];

    reviewElements.forEach((reviewEl) => {
        existingReviews.push({
            content: reviewEl.innerHTML,
            isStatic: true,
        })

    });

    return existingReviews;
}

const staticReviews = loadExistingReviews();

// ** 서버에서 기존 리뷰 불러오기 (초기화 시)**
async function loadReviews() {
    try {
        const response = await axios.get('http://localhost:3000/reviews');
        const reviews = response.data;

        // 현재 페이지(`pageId`)에 해당하는 리뷰만 필터링

        const filteredReviews = reviews.filter(review => review.pageId === pageId);

        // ** 기존 리뷰 목록을 클리어하여 중복 방지 **
        reviewsList.innerHTML = '';

        //html 리뷰 먼저 추가
        staticReviews.forEach(addReviewToList);

        ratings = filteredReviews.map(review => ({ id: String(review.id), rating: review.rating }));



        filteredReviews.forEach(review => {

            // 리뷰 요소 추가 함수 호출
            addReviewToList(review);

           
        });

        // 평균 평점 업데이트
        updateAverageRating();
    } catch (error) {
        console.error("서버에서 리뷰를 불러오는 중 오류 발생:", error);
    }
}

//리뷰 목록에 추가하는 함수 (로그인 여부와 무관하게 리뷰를 표시)
function addReviewToList(review) {


    //  리뷰 컨테이너 (`div.review-item`)
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review-item');

    reviewElement.dataset.id = String(review.id);  // <-- 문자열로 변환!


    if (review.isStatic) {
        reviewElement.innerHTML = review.content;
    }
    else {

        // 리뷰 내용 (`div.review-content`)
        const reviewContent = document.createElement('p');
        reviewContent.classList.add('review-content');
        reviewElement.innerHTML = `<p><strong>${review.nickname}:</strong> &nbsp <span class = "review-text"> ${review.review}<span> (평점: ${review.rating}점)</p>`;

        reviewElement.appendChild(reviewContent);
    }




    //  로그인한 사용자가 해당 리뷰의 작성자(clientId)와 일치할 경우 삭제 버튼 추가
    //  html에 작성된 리뷰는 삭제 버튼을 추가하지 않음
    if (!review.isStatic && loggedInUser && review.clientId === loggedInUser.clientId) {
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "&#10006;"; //x 아이콘 html 엔티티
        deleteButton.classList.add("delete-button");
        deleteButton.title = "삭제"; // 마우스를 올리면 '삭제'라고 표시됨

        //  삭제 버튼 클릭 시 확인 팝업 띄우기
        deleteButton.addEventListener("click", () => {

            if (!review.id) {
                alert("삭제할 리뷰 ID가 존재하지 않습니다!");
                return;
            }


            const confirmDelete = confirm("정말 이 리뷰를 삭제하시겠습니까?");
            if (confirmDelete) {
                deleteReview(String(review.id));  //삭제 함수 실행
            }
        });

        reviewElement.appendChild(deleteButton); // 삭제 버튼 추가
    }

    reviewsList.appendChild(reviewElement);
}





// 페이지 로드 시 서버에서 기존 리뷰 불러오기
loadReviews();

// ** 리뷰 작성 이벤트 처리 + Axios 사용 (JSON 서버 연동)**
reviewForm.addEventListener('submit', async function (e) {
    // 로그인되지 않은 사용자는 리뷰 폼을 비활성화

    e.preventDefault();

    // 입력 값 가져오기
    const reviewContent = reviewText.value.trim();
    const ratingValue = parseInt(ratingSelect.value, 10);

    // 필수 입력 확인
    if (!reviewContent || isNaN(ratingValue)) {
        alert('모든 필드를 입력해주세요.');
        return;
    }


    //loggedInuser가 존재하는지 확인
    const nickname = loggedInUser ? loggedInUser.clientNick : "익명";
    const clientId = loggedInUser ? loggedInUser.clientId : null;


    // 새로운 리뷰 객체 생성
    const newReview = {
        pageId: pageId,
        nickname: nickname,
        clientId: clientId, //닉네임은 변경 가능하기에 변경 불가능한 id로 선정정
        review: reviewContent,
        rating: ratingValue,
    };

    try {
        // ** Axios를 사용하여 서버에 데이터 전송**
        const response = await axios.post("http://localhost:3000/reviews", newReview);
        

        if (response.status === 201) {

            const createdReview = response.data;
            // 리뷰 목록에 추가
            addReviewToList(createdReview);
            // 평점 데이터에 추가
            ratings.push({ id: String(createdReview.id), rating: Number(createdReview.rating) });

            // 평균 평점 업데이트
            updateAverageRating();

            // 입력 필드 초기화
            reviewForm.reset();

            // 성공 메시지 표시
            alert('리뷰가 성공적으로 등록되었습니다!');
        }
    } catch (error) {
        console.error("서버로 데이터 전송 중 오류 발생:", error);
        alert("리뷰 저장에 실패했습니다. 다시 시도해주세요.");
    }
});



async function deleteReview(reviewId) {
    try {
        //  서버에 삭제 요청 보내기

        const reviewIdStr = String(reviewId);

        const response = await axios.delete(`http://localhost:3000/reviews/${String(reviewId)}`);

        if (response.status === 200 || response.status === 204) {


            //  `loadReviews()`를 호출하는 대신, 해당 리뷰만 제거
            const reviewElement = document.querySelector(`.review-item[data-id="${reviewIdStr}"]`);
            if (reviewElement) {
                reviewElement.remove(); // 해당 리뷰 삭제
            }

            // 평균 평점 업데이트
            ratings = ratings.filter(r => r.id !== reviewIdStr);


            updateAverageRating();

            alert("리뷰가 삭제되었습니다.");
        } else {
            alert("리뷰 삭제에 실패했습니다. 다시 시도해주세요.");
        }

    } catch (error) {
        console.error("리뷰 삭제 중 오류 발생:", error);
        alert("리뷰 삭제에 실패했습니다. 다시 시도해주세요.");
    }
}


// 팝업 열기 함수
function openPopup() {
    document.getElementById("popup").style.display = "block";
}

// 팝업 닫기 함수
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// 동작부위 버튼 클릭 시 팝업 열기
document.querySelector(".hover-button").addEventListener("click", openPopup);
