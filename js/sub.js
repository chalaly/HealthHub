'use strict';

// 로그인 사용자 정보 불러오기
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));


// 리뷰 관련 요소 가져오기
const pageId = document.querySelector("main").id; // id로 가져오면 js전체 바꿔야함함
console.log(pageId);
const reviewsList = document.getElementById('reviews-list');
const averageRatingValue = document.getElementById('average-rating-value');
const reviewForm = document.getElementById('review-form');
const reviewText = document.getElementById('review-text');
const ratingSelect = document.getElementById('rating');
const submitButton = document.querySelector("#review-form button[type='submit']");


let ratings = []; // 기존 초기 평점 데이터



// 평균 평점 계산 함수
function calculateAverageRating() {
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return (total / ratings.length).toFixed(1); // 소수점 첫째 자리까지 표시
}

// 평균 평점 업데이트 함수
function updateAverageRating() {
    averageRatingValue.textContent = calculateAverageRating();
}



// 페이지 로드 시 평균 평점 표시
updateAverageRating();

//  로그인되지 않은 사용자는 리뷰 폼을 비활성화
if (!loggedInUser) {

    reviewText.disabled = true;  // 텍스트 입력 비활성화
    ratingSelect.disabled = true; // 평점 선택 비활성화
    submitButton.disabled = true; // 제출 버튼 비활성화
    reviewForm.style.opacity = '0.3';
    submitButton.style.pointerEvents = "none";
}

// 이미지 hover 효과
window.showImage = function () {
    document.getElementById('hoverImage').style.display = 'block';
};

window.hideImage = function () {
    document.getElementById('hoverImage').style.display = 'none';
};

// ** 서버에서 기존 리뷰 불러오기 (초기화 시)**
async function loadReviews() {
    try {
        console.log(" 서버에서 리뷰 데이터 요청 중...");
        const response = await axios.get('http://localhost:3000/reviews');
        const reviews = response.data;

        // 현재 페이지(`pageId`)에 해당하는 리뷰만 필터링

        const filteredReviews = reviews.filter(review => review.pageId === pageId);

        if (!filteredReviews.length) {
            console.log(`⚠ ${pageId} 페이지에 대한 리뷰가 없습니다.`);
        } else {
            console.log(`${pageId} 페이지에 대한 리뷰 데이터:`, filteredReviews);
        }



        // ** 기존 리뷰 목록을 클리어하여 중복 방지 **
        reviewsList.innerHTML = '';

        filteredReviews.forEach(review => {

            // 리뷰 요소 추가 함수 호출
            addReviewToList(review);

            // 기존 평점 데이터 추가
            ratings.push(review.rating);
        });

        // 평균 평점 업데이트
        updateAverageRating();
    } catch (error) {
        console.error("서버에서 리뷰를 불러오는 중 오류 발생:", error);
    }
}

//리뷰 목록에 추가하는 함수 (로그인 여부와 무관하게 리뷰를 표시)
function addReviewToList(review) {
    console.log(` 리뷰 추가됨: ${review.nickname} - ${review.review} (평점: ${review.rating})`);
    //  리뷰 컨테이너 (`div.review-item`)
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review-item');

    // 리뷰 내용 (`div.review-content`)
    const reviewContent = document.createElement('p');
    reviewContent.classList.add('review-content');
    reviewElement.innerHTML = `<strong>${review.nickname}:</strong> &nbsp <span class = "review-text"> ${review.review}<span> (평점: ${review.rating}점)`;

    reviewElement.appendChild(reviewContent);

    //  로그인한 사용자가 해당 리뷰의 작성자(clientId)와 일치할 경우 삭제 버튼 추가
    if (loggedInUser && review.clientId === loggedInUser.clientId) {
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "&#10006;"; //x 아이콘 html 엔티티티
        deleteButton.classList.add("delete-button");
        deleteButton.title = "삭제"; // 마우스를 올리면 '삭제'라고 표시됨

        //  삭제 버튼 클릭 시 확인 팝업 띄우기
        deleteButton.addEventListener("click", () => {
            const confirmDelete = confirm("정말 이 리뷰를 삭제하시겠습니까?");
            if (confirmDelete) {
                deleteReview(review.id);
            }
        });

        reviewElement.appendChild(deleteButton); // 삭제 버튼 추가가
    }

    reviewsList.appendChild(reviewElement);
}


console.log(" loadReviews() 실행 준비 완료!");


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
            // 리뷰 목록에 추rk
            addReviewToList(newReview);
            // 평점 데이터에 추가
            ratings.push(ratingValue);

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
        await axios.delete(`http://localhost:3000/reviews/${reviewId}`);

        //  삭제된 리뷰를 화면에서도 제거
        loadReviews(); // 서버에서 최신 리뷰 목록 다시 불러오기

        alert("리뷰가 삭제되었습니다.");
    } catch (error) {
        console.error("리뷰 삭제 중 오류 발생:", error);
        alert("리뷰 삭제에 실패했습니다. 다시 시도해주세요.");
    }
}