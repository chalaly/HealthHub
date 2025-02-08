'use strict'

const apiUrl = 'http://localhost:3000/questions';
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// 입력란 및 버튼 요소 가져오기
const titleInput = document.getElementById('question-title');
const contentInput = document.getElementById('question-content');
const submitButton = document.getElementById('submit-question');

if (!loggedInUser || loggedInUser.clientId === "admin") {
    titleInput.disabled = true;
    contentInput.disabled = true;
    submitButton.disabled = true;
    alert("질문 작성 권한이 없습니다.");
}

// 질문 추가하기
function addQuestion() {
    const title = titleInput.value;
    const content = contentInput.value;
    
    if (!title || !content) {
        alert('질문 제목과 내용을 입력하세요.');
        return;
    }

    axios.post(apiUrl, { title, content, answer: '', author: loggedInUser.clientNick })
        .then(() => {
            titleInput.value = '';
            contentInput.value = '';
            loadQuestions();
        });
}

// 질문 불러오기
function loadQuestions() {
    axios.get(apiUrl)
        .then(res => {
            const questionList = document.getElementById('questions-list');
            questionList.innerHTML = '';
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
