const btn = document.querySelector('.btn');
btn.onclick = Counter;
const clicks = document.querySelector('.clicks');
clicks.id = document.querySelector('clicks');

var button_clicks = 0;

function Counter() {
    button_clicks += 1;
    clicks.innerHTML = button_clicks;
}
