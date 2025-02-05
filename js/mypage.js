'use strict';

document.addEventListener("DOMContentLoaded", async function () {
    const userNameEl = document.getElementById("user-name");
    const userEmailEl = document.getElementById("user-email");
    const userNickEl = document.getElementById("nick-name");
    const activityListEl = document.getElementById("activity-list");
    const editProfileBtn = document.getElementById("edit-profile-btn");
    const editNickBtn = document.getElementById("edit-nick-btn");

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

        const users = response.data;
        const reviews = reviewsResponse.data;

        console.log(reviews);

        //  로그인한 사용자 정보 찾기
        const user = users.find(user => user.clientId === loggedInUser.clientId);

        if (user) {
            userNameEl.textContent = user.clientName;
            userEmailEl.textContent = user.clientId; // 이메일 = 아이디
            userNickEl.textContent = user.clientNick;


            //  사용자가 작성한 리뷰만 필터링
            const userReviews = reviews.filter(review => review.nickname === user.clientNick);

            console.log(userReviews);

            if (userReviews.length > 0) {
                userReviews.forEach(review => {
                    const reviewItem = document.createElement("p");
                    reviewItem.textContent = `📝 ${review.review} (평점: ${review.rating}점)`;
                    activityListEl.appendChild(reviewItem);
                });
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

    editProfileBtn.addEventListener("click",function(){
        location.href="./editProfile.html";
    })

    editNickBtn.addEventListener("click", function () {
        location.href = "./editNick.html";
    })

    
});
