let totalQuestions = 0;

while (true) {
  let input = prompt("Enter number of questions (1 to 200):");
  totalQuestions = parseInt(input);

  if (!isNaN(totalQuestions) && totalQuestions >= 1 && totalQuestions <= 200) {
    break;
  } else {
    alert("Please enter a valid number between 1 and 200.");
  }
}
let omrSheet = document.getElementById('omr-sheet');
let history = [];

function createOMRSheet(totalQuestions = 180) {
  for (let i = 1; i <= totalQuestions; i++) {
    let qDiv = document.createElement('div');
    qDiv.className = 'question';
    qDiv.setAttribute('data-question', i);

    let label = document.createElement('div');
    label.className = 'q-label';
    label.textContent = `Q${i}.`;

    qDiv.appendChild(label);

    ['a', 'b', 'c', 'd'].forEach(opt => {
      let circle = document.createElement('div');
      circle.className = 'option';
      circle.textContent = opt;
      circle.setAttribute('data-value', opt);
      circle.onclick = function () {
        [...qDiv.getElementsByClassName('option')].forEach(opt => opt.classList.remove('selected'));
        circle.classList.add('selected');
        history.push(circle);
      };
      qDiv.appendChild(circle);
    });

    omrSheet.appendChild(qDiv);
  }
}

function resetAll() {
  document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
  history = [];
  document.getElementById("summary").innerHTML = "";
  document.getElementById("attempt-summary").innerText = "";
}

function undoLast() {
  if (history.length > 0) {
    let last = history.pop();
    last.classList.remove('selected');
  }
}

function showSummary() {
  const summaryDiv = document.getElementById("summary");
  const attemptSummaryDiv = document.getElementById("attempt-summary");

  summaryDiv.innerHTML = "";
  let attempted = 0;
  let unattempted = 0;

  for (let i = 1; i <= totalQuestions; i++) {  // ← Use the dynamic value
    const qDiv = document.querySelector(`.question[data-question="${i}"]`);
    const selected = qDiv.querySelector('.option.selected');
    if (selected) {
      const answer = selected.getAttribute('data-value');
      const item = document.createElement("div");
      item.textContent = `Q${i}. (${answer})`;
      summaryDiv.appendChild(item);
      attempted++;
    } else {
      unattempted++;
    }
  }

  // If you still want to show this summary line, otherwise skip this
  attemptSummaryDiv.innerText = `Total Attempted: ${attempted} | Total Unattempted: ${unattempted}`;
}

createOMRSheet(totalQuestions);













