const btn = document.querySelector('.btn');
btn.onclick = Counter;
const clicks = document.querySelector('.clicks');
clicks.id = document.querySelector('clicks');
const label = document.getElementById("name-label")
const submit = document.getElementById("name-submit")

var button_clicks = 0;


function Counter() {
    button_clicks += 1;
    clicks.innerHTML = button_clicks;
}

function updateName() {
  const username = document.getElementById("name-input").value
  // window.alert("Hello " + document.getElementById("name-input").value + ",welcome to class")
//   window.alert(`Hello ${username}, welcome to class`)
  label.innerText = `Your name is ${username}. Change it here:`
  submit.innerText = "Change"
}