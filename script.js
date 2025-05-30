let totalQuestions = 0;
let history = [];
let omrSheet = document.getElementById('omr-sheet');
let countdownInterval;

document.getElementById("start-btn").onclick = function () {
  let input = prompt("Enter number of questions (1 to 200):");
  if (input === null) return;
  totalQuestions = parseInt(input);
  if (isNaN(totalQuestions) || totalQuestions < 1 || totalQuestions > 200) {
    alert("Please enter a valid number between 1 and 200.");
    return;
  }

  let optionCount = prompt("How many options per question? (2 to 5):");
  if (optionCount === null) return;
  optionCount = parseInt(optionCount);
  if (isNaN(optionCount) || optionCount < 2 || optionCount > 5) {
    alert("Please enter a number between 2 and 5.");
    return;
  }

  let labelType = prompt("Choose label format:\n1 for a, b, c...\n2 for A, B, C...\n3 for 1, 2, 3...");
  if (labelType === null) return;
  labelType = parseInt(labelType);
  if (![1, 2, 3].includes(labelType)) {
    alert("Please enter 1, 2 or 3.");
    return;
  }

  this.style.display = "none";
  document.getElementById("start-again-btn").style.display = "inline-block";
  createOMRSheet(totalQuestions, optionCount, labelType);
  document.getElementById("start-timer-btn").style.display = "inline-block";
};

document.getElementById("start-again-btn").onclick = function () {
  const confirmStartAgain = confirm("Do you want to start again?");
  if (!confirmStartAgain) return;

  omrSheet.innerHTML = "";
  document.getElementById("summary").innerHTML = "";
  document.getElementById("attempt-summary").innerText = "";
  history = [];
  this.style.display = "none";
  document.getElementById("start-btn").style.display = "inline-block";
  stopCountdown();
  document.getElementById("countdown-container").style.display = "none";
  document.getElementById("start-timer-btn").style.display = "none";
};

function createOMRSheet(total, optionCount, labelType) {
  for (let i = 1; i <= total; i++) {
    const qDiv = document.createElement('div');
    qDiv.className = 'question';
    qDiv.setAttribute('data-question', i);

    const label = document.createElement('div');
    label.className = 'q-label';
    label.textContent = `Q${i}.`;
    qDiv.appendChild(label);

    let options = [];
    for (let j = 0; j < optionCount; j++) {
      if (labelType === 1) options.push(String.fromCharCode(97 + j));
      else if (labelType === 2) options.push(String.fromCharCode(65 + j));
      else options.push((j + 1).toString());
    }

    options.forEach(opt => {
      const circle = document.createElement('div');
      circle.className = 'option';
      circle.textContent = opt;
      circle.setAttribute('data-value', opt);
      circle.onclick = function () {
        const alreadySelected = qDiv.querySelector('.option.selected');
        if (alreadySelected) return;
        circle.classList.add('selected');
        history.push(circle);
      };
      qDiv.appendChild(circle);
    });

    omrSheet.appendChild(qDiv);
  }
}

function resetAll() {
  const confirmReset = confirm("Do you want to reset again?");
  if (!confirmReset) return;

  document.querySelectorAll('.option.selected').forEach(opt => opt.classList.remove('selected'));
  history = [];
  document.getElementById("summary").innerHTML = "";
  document.getElementById("attempt-summary").innerText = "";
  stopCountdown();
  document.getElementById("countdown-container").style.display = "none";
  document.getElementById("start-timer-btn").style.display = "inline-block";
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

  let unattemptedList = [];

  for (let i = 1; i <= totalQuestions; i++) {
    const qDiv = document.querySelector(`.question[data-question="${i}"]`);
    const selected = qDiv.querySelector('.option.selected');
    if (selected) {
      const answer = selected.getAttribute('data-value');
      const item = document.createElement("div");
      item.textContent = `Q${i}. (${answer})`;
      item.classList.add('summary-item');

      item.addEventListener('click', function () {
        if (item.classList.contains('correct')) {
          item.classList.remove('correct');
          item.classList.add('incorrect');
        } else if (item.classList.contains('incorrect')) {
          item.classList.remove('incorrect');
        } else {
          item.classList.add('correct');
        }
        updateFooter();
      });

      summaryDiv.appendChild(item);
      attempted++;
    } else {
      unattemptedList.push(i);
    }
  }

  let unattempted = totalQuestions - attempted;
  let footerText = `Total Attempted: ${attempted} | Total Unattempted: ${unattempted} | Correct: 0 | Incorrect: 0`;

  // Add unattempted questions list
  if (unattemptedList.length > 0) {
    let list = unattemptedList.join(', ');
    footerText += `\nUnattempted Questions: ${list}`;
  }

  attemptSummaryDiv.innerText = footerText;
}

function updateFooter() {
  const allItems = document.querySelectorAll(".summary-item");
  let correct = 0, incorrect = 0;

  allItems.forEach(item => {
    if (item.classList.contains("correct")) correct++;
    else if (item.classList.contains("incorrect")) incorrect++;
  });

  let attempted = allItems.length;
  let unattempted = totalQuestions - attempted;

  let text = `Total Attempted: ${attempted} | Total Unattempted: ${unattempted} | Correct: ${correct} | Incorrect: ${incorrect}`;

  // Show unattempted question numbers again
  let unattemptedList = [];
  for (let i = 1; i <= totalQuestions; i++) {
    const qDiv = document.querySelector(`.question[data-question="${i}"]`);
    const selected = qDiv.querySelector('.option.selected');
    if (!selected) unattemptedList.push(i);
  }

  if (unattemptedList.length > 0) {
    let list = unattemptedList.join(', ');
    text += `\nUnattempted Questions: ${list}`;
  }

  document.getElementById("attempt-summary").innerText = text;
}

function startTimer() {
  const minutes = prompt("Enter countdown time in minutes (1-540):");
  const duration = parseInt(minutes);

  if (isNaN(duration) || duration < 1 || duration > 540) {
    alert("Please enter a valid number between 1 and 540.");
    return;
  }

  document.getElementById("start-timer-btn").style.display = "none";
  const container = document.getElementById("countdown-container");
  container.style.display = "block";

  let time = duration * 60;

  if (countdownInterval) clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    if (time < 0) {
      clearInterval(countdownInterval);
      container.textContent = "Time's up!";
      alert("Time's up!");
      return;
    }

    const mins = Math.floor(time / 60);
    const secs = time % 60;
    container.textContent = `Time Left: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    time--;
  }, 1000);
}

function stopCountdown() {
  clearInterval(countdownInterval);
}



// Feature: Upload Answer Key and auto mark correct/incorrect
const uploadInput = document.createElement("input");
uploadInput.type = "file";
uploadInput.accept = ".txt";
uploadInput.style.display = "block";
uploadInput.style.margin = "20px auto";
uploadInput.onchange = function () {
  const file = uploadInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const answerKey = e.target.result.trim().split(/\r?\n/);
    applyAnswerKey(answerKey);
  };
  reader.readAsText(file);
};
document.body.appendChild(uploadInput);

function applyAnswerKey(answerKey) {
  const summaryDiv = document.getElementById("summary");
  const summaryItems = summaryDiv.querySelectorAll(".summary-item");

  summaryItems.forEach(item => {
    const qNum = parseInt(item.textContent.match(/\d+/)[0]);
    const selectedAns = item.textContent.match(/\(([^\)]+)\)/)[1].trim();

    let line = answerKey[qNum - 1]?.trim();
    if (!line) return;

    let correctAns = line.includes('=') ? line.split('=')[1].trim() : line.trim();

    // Normalize both selected and correct answers
    const normalize = val => {
      if (!val) return '';
      if (!isNaN(val)) return val; // number like "1", "2"
      return val.toLowerCase();    // a–e or A–E → lowercase
    };

    if (normalize(selectedAns) === normalize(correctAns)) {
      item.classList.remove("incorrect");
      item.classList.add("correct");
    } else {
      item.classList.remove("correct");
      item.classList.add("incorrect");
    }
  });

  updateFooter();
}
