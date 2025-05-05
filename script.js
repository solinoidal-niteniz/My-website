let totalQuestions = 0;
let history = [];
let omrSheet = document.getElementById('omr-sheet');

document.getElementById("start-btn").onclick = function () {
  let input = prompt("Enter number of questions (1 to 200):");
  if (input === null) return;  // Cancel pressed

  totalQuestions = parseInt(input);

  if (!isNaN(totalQuestions) && totalQuestions >= 1 && totalQuestions <= 200) {
    this.style.display = "none";
    document.getElementById("start-again-btn").style.display = "inline-block";
    createOMRSheet(totalQuestions);
  } else {
    alert("Please enter a valid number between 1 and 200.");
  }
};

document.getElementById("start-again-btn").onclick = function () {
  omrSheet.innerHTML = "";
  document.getElementById("summary").innerHTML = "";
  document.getElementById("attempt-summary").innerText = "";
  history = [];

  this.style.display = "none";
  document.getElementById("start-btn").style.display = "inline-block";
};

function createOMRSheet(total) {
  for (let i = 1; i <= total; i++) {
    const qDiv = document.createElement('div');
    qDiv.className = 'question';
    qDiv.setAttribute('data-question', i);

    const label = document.createElement('div');
    label.className = 'q-label';
    label.textContent = `Q${i}.`;

    qDiv.appendChild(label);

    ['a', 'b', 'c', 'd'].forEach(opt => {
      const circle = document.createElement('div');
      circle.className = 'option';
      circle.textContent = opt;
      circle.setAttribute('data-value', opt);
      circle.onclick = function () {
  // Check if any option in this question is already selected
  const alreadySelected = qDiv.querySelector('.option.selected');
  if (alreadySelected) {
    return; // Do nothing if already selected (locked)
  }

  // Lock this option
  circle.classList.add('selected');
  history.push(circle);
};
      qDiv.appendChild(circle);
    });

    omrSheet.appendChild(qDiv);
  }
}

function resetAll() {
  document.querySelectorAll('.option.selected').forEach(opt => opt.classList.remove('selected'));
  history = [];
  document.getElementById("summary").innerHTML = "";
  document.getElementById("attempt-summary").innerText = "";
}

function undoLast() {
  if (history.length > 0) {
    const last = history.pop();
    last.classList.remove('selected');
  }
}

function showSummary() {
  const summaryDiv = document.getElementById("summary");
  const attemptSummaryDiv = document.getElementById("attempt-summary");
  summaryDiv.innerHTML = "";

  let attempted = 0;

  for (let i = 1; i <= totalQuestions; i++) {
    const qDiv = document.querySelector(`.question[data-question="${i}"]`);
    const selected = qDiv.querySelector('.option.selected');
    if (selected) {
      const answer = selected.getAttribute('data-value');
      const item = document.createElement("div");
      item.textContent = `Q${i}. (${answer})`;
      summaryDiv.appendChild(item);
      attempted++;
    }
  }

  let unattempted = totalQuestions - attempted;
  attemptSummaryDiv.innerText = `Total Attempted: ${attempted} | Total Unattempted: ${unattempted}`;
}
