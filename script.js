var text_area = document.getElementById("text_area");
var root = document.getElementById("root");

var body_text = "";
text_area.value = body_text;

var highlights = [];

function getSelectionCharacterOffsetWithin(element) {
  var start = 0;
  var end = 0;
  var sel, range, priorRange;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      priorRange = range.cloneRange();
      priorRange.selectNodeContents(element);
      priorRange.setEnd(range.startContainer, range.startOffset);
      start = priorRange.toString().length;
      priorRange.setEnd(range.endContainer, range.endOffset);
      end = priorRange.toString().length;
    }
  }
  return { start: start, end: end };
}

function isHighlighted(index) {
  for (let i = 0; i < highlights.length; i++) {
    if (index >= highlights[i].start && index <= highlights[i].end) {
      return true;
    }
  }
  return false;
}

function render() {
  let html = '';
  html += '<div class="annotated_text">';
  html += text_area.value;
  html += '</div>';
  root.innerHTML = html;

  html = '';
  let highlighted = false;
  for (let i = 0; i < body_text.length; i++) {
    if (isHighlighted(i) && !highlighted) {
      html += '<span style="background:yellow">';
      highlighted = true;
    }
    if (!isHighlighted(i) && highlighted) {
      html += '</span>';
      highlighted = false;
    }
    html += body_text[i];
  }
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
