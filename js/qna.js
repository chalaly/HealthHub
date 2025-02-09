'use strict'

const apiUrl = 'http://localhost:3000/questions'; // 질문 목록을 가져오거나 질문을 추가할 때 사용되는 API 주소
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // 로컬 스토리지에서 로그인한 사용자 정보를 가져옴

// 입력란 및 버튼 요소 가져오기
const titleInput = document.getElementById('question-title'); // 질문 제목 입력란
const contentInput = document.getElementById('question-content'); // 질문 내용 입력란
const submitButton = document.getElementById('submit-question'); // 질문 제출 버튼

// 로그인한 사용자가 없거나 관리자인 경우 질문 작성 권한 제한
if (!loggedInUser || loggedInUser.clientId === "admin") {
    titleInput.disabled = true; // 질문 제목 입력 비활성화
    contentInput.disabled = true; // 질문 내용 입력 비활성화
    submitButton.disabled = true; // 질문 제출 버튼 비활성화
    alert("질문 작성 권한이 없습니다."); // 경고 메시지 표시
}

// 질문 추가하기
function addQuestion() {
    const title = titleInput.value; // 질문 제목 입력값 가져오기
    const content = contentInput.value; // 질문 내용 입력값 가져오기

    // 질문 제목 또는 내용이 비어있는 경우 경고 메시지 표시
    if (!title || !content) {
        alert('질문 제목과 내용을 입력하세요.');
        return;
    }

    // axios를 사용하여 API에 POST 요청을 보내 질문 추가
    axios.post(apiUrl, { title, content, answer: '', author: loggedInUser.clientNick })
        .then(() => {
            titleInput.value = ''; // 질문 제목 입력란 초기화
            contentInput.value = ''; // 질문 내용 입력란 초기화
            loadQuestions(); // 질문 목록 다시 불러오기
        });
}

// 질문 불러오기
function loadQuestions() {
    axios.get(apiUrl) // axios를 사용하여 API에 GET 요청을 보내 질문 목록 가져오기
        .then(res => {
            const questionList = document.getElementById('questions-list'); // 질문 목록을 표시할 요소 가져오기
            questionList.innerHTML = ''; // 질문 목록 초기화
            // 로그인한 사용자가 작성한 질문만 필터링하여 목록에 추가
            res.data.filter(q => q.author === loggedInUser.clientNick).forEach(q => {
                questionList.innerHTML += `
                    <div class="question-box">
                        <p><strong>작성자 :</strong> ${q.author || '익명'}</p>
                        <p><strong>${q.title} :</strong> ${q.content}</p>
                        <p><strong>답변 :</strong> ${q.answer || '아직 답변이 없습니다.'}</p>
                    </div>
                `;
            });
        });
}

// 페이지 로드 시 질문 목록 불러오기
document.addEventListener("DOMContentLoaded", loadQuestions);
