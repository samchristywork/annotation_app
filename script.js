var text_area = document.getElementById("text_area");
var root = document.getElementById("root");

var body_text = "";
text_area.value = body_text;

function render() {
  let html = '';
  html += '<div class="annotated_text">';
  html += text_area.value;
  html += '</div>';
  root.innerHTML = html;
}

function submit() {
  let html = '';
  html += '<div class="annotated_text">';
  html += text_area.value;
  html += '</div>';
  root.innerHTML = html;

  render();
}
