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

function getHighlightClasses(index) {
  let classList = [];
  for (let i = 0; i < highlights.length; i++) {
    if (index >= highlights[i].start && index < highlights[i].end) {
      classList.push(highlights[i].classes);
    }
  }

  classList.sort();

  return classList;
}

function render() {
  let html = '';
  html += '<div class="annotated_text">';
  html += text_area.value;
  html += '</div>';
  root.innerHTML = html;

  var inflectionPoints = [0, body_text.length];
  for (let i = 0; i < highlights.length; i++) {
    inflectionPoints.push(highlights[i].start);
    inflectionPoints.push(highlights[i].end);
  }

  inflectionPoints.sort(function(a, b) {
    return a - b;
  });

  html = '';
  for (let i = 0; i < inflectionPoints.length - 1; i++) {
    let a = inflectionPoints[i];
    let b = inflectionPoints[i + 1];

    let classList = getHighlightClasses(a);
    html += '<span class="' + classList.join(" ") + '">';
    html += body_text.substring(a, b);
    html += '</span>';
  }
  root.innerHTML = html;
}

function addHighlighting(selection, classes) {
  let highlight = {};
  highlight.start = selection.start;
  highlight.end = selection.end;
  highlight.classes = classes;

  highlights.push(highlight);

  render();
}

function submit() {
  let html = '';
  html += '<div class="annotated_text">';
  html += text_area.value;
  html += '</div>';
  root.innerHTML = html;

  document.addEventListener("keydown", function(e) {
    let key = e.key;
    let selection = getSelectionCharacterOffsetWithin(root);

    switch (key) {
      case "1":
        addHighlighting(selection, "normal");
        break;
      case "2":
        addHighlighting(selection, "error");
        break;
      default:
        console.log("Key not recognized:", key);
        break;
    }
  });

  render();
}
