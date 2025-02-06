
const apiUrl = 'http://localhost:3000/questions';

// 질문 추가하기
function addQuestion() {
    const title = document.getElementById('question-title').value;
    const content = document.getElementById('question-content').value;
    
    if (!title || !content) {
        alert('질문 제목과 내용을 입력하세요.');
        return;
    }

    axios.post(apiUrl, { title, content, answer: '' })
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
            res.data.forEach(q => {
                questionList.innerHTML += `
                    <div class="question-box">
                        <h4>${q.title}</h4>
                        <p>${q.title} : ${q.content}</p>
                        <p><strong>답변:</strong> ${q.answer || '아직 답변이 없습니다.'}</p>
                    </div>
                `;
            });
        });
}

// 페이지 로드 시 질문 목록 불러오기
document.addEventListener("DOMContentLoaded", loadQuestions);