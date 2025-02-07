'use strict'

const apiUrl = 'http://localhost:3000/questions';
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser || loggedInUser.clientId === "admin") {

    addQuestion.disabled = true;
    textarea.disabled = true;
    button.disabled = true;
    button.style.pointerEvents = "none";
}

// 질문 추가하기
function addQuestion() {
    const title = document.getElementById('question-title').value;
    const content = document.getElementById('question-content').value;
    
    if (!title || !content) {
        alert('질문 제목과 내용을 입력하세요.');
        return;
    }

    axios.post(apiUrl, { title, content, answer: '', author: loggedInUser.clientNick })
        .then(() => {
            document.getElementById('question-title').value = '';
            document.getElementById('question-content').value = '';
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
