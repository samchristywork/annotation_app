var text_area = document.getElementById("text_area");
var root = document.getElementById("root");
var highlight_controls = document.getElementById("highlight_controls");

var body_text = "";
text_area.value = body_text;

var highlights = [];

function clearHighlights() {
  highlights = [];
  render();
}

function exportHTML() {
  let html = '';
  html += '<div class="annotated_text" id="annotated_text">';
  html += '&lt;span style="white-space: pre-wrap;"&gt;';

  var inflectionPoints = [0, body_text.length];
  for (let i = 0; i < highlights.length; i++) {
    inflectionPoints.push(highlights[i].start);
    inflectionPoints.push(highlights[i].end);
  }

  inflectionPoints.sort(function(a, b) {
    return a - b;
  });

  for (let i = 0; i < inflectionPoints.length - 1; i++) {
    let a = inflectionPoints[i];
    let b = inflectionPoints[i + 1];

    let colors = getHighlightColors(a);
    let index = getHighlightIndex(a);
    if (index.length > 0) {
      html += '&lt;span " style="' + getStyle(colors) + '"&gt;';
    } else {
      html += '&lt;span style="' + getStyle(colors) + '"&gt;';
    }
    html += body_text.substring(a, b);
    html += '&lt;/span&gt;';
  }

  html += '</span>';
  html += '</span>';
  root.innerHTML = html;
}

function deleteHighlight(index) {
  var selection = window.getSelection();
  if (selection.type === 'Range' && selection.toString().length > 0) {
  } else {
    highlights.splice(index, 1);
    render();
  }
}

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

function getHighlightColors(index) {
  let colorList = [];
  for (let i = 0; i < highlights.length; i++) {
    if (index >= highlights[i].start && index < highlights[i].end) {
      colorList.push(highlights[i].color);
    }
  }

  colorList.sort();

  for (let i = 0; i < colorList.length - 1; i++) {
    if (colorList[i] == colorList[i + 1]) {
      colorList.splice(i, 1);
      i--;
    }
  }

  return colorList;
}

function getHighlightIndex(index) {
  let colorList = [];
  for (let i = 0; i < highlights.length; i++) {
    if (index >= highlights[i].start && index < highlights[i].end) {
      return [i];
    }
  }

  return [];
}

function getStyle(colors) {
  if (colors.length == 0) {
    return '';
  }

  let style = '';
  style += 'background-image: repeating-linear-gradient(45deg, ';

  let offset = 6;

  for (let i = 0; i < colors.length; i++) {
    style += colors[i];
    style += ' ';
    style += i * offset;
    style += 'px, ';

    style += colors[i];
    style += ' ';
    style += (i + 1) * offset;
    style += 'px, ';
  }

  style += colors[0];
  style += ' ';
  style += colors.length * offset;
  style += 'px);';

  return style;
}

function highlightMatches() {
  let regex = document.getElementById("highlight_regex").value;
  let color = document.getElementById("highlight_color").value;

  let re = new RegExp(regex, "g");
  let match;
  while ((match = re.exec(body_text)) != null) {
    let selection = {};
    selection.start = match.index;
    selection.end = match.index + match[0].length;
    addHighlighting(selection, color);
  }
}

function render() {
  let html = '';
  html += '<div class="annotated_text" id="annotated_text">';

  var inflectionPoints = [0, body_text.length];
  for (let i = 0; i < highlights.length; i++) {
    inflectionPoints.push(highlights[i].start);
    inflectionPoints.push(highlights[i].end);
  }

  inflectionPoints.sort(function(a, b) {
    return a - b;
  });

  for (let i = 0; i < inflectionPoints.length - 1; i++) {
    let a = inflectionPoints[i];
    let b = inflectionPoints[i + 1];

    let colors = getHighlightColors(a);
    let index = getHighlightIndex(a);
    if (index.length > 0) {
      html += '<span onclick="deleteHighlight(' + index[0] + ')" style="' + getStyle(colors) + '">';
    } else {
      html += '<span onclick="" style="' + getStyle(colors) + '">';
    }
    html += body_text.substring(a, b);
    html += '</span>';
  }
  html += '</span>';
  root.innerHTML = html;
}

function addHighlighting(selection, color) {
  let highlight = {};
  highlight.start = selection.start;
  highlight.end = selection.end;
  highlight.color = color;

  highlights.push(highlight);

  render();
}

function submit() {
  body_text = text_area.value;

  highlight_controls.classList.remove("hidden");

  document.addEventListener("keydown", function(e) {
    let key = e.key;
    let selection = getSelectionCharacterOffsetWithin(root);

    switch (key) {
      case "1":
        addHighlighting(selection, "#ffa");
        break;
      case "2":
        addHighlighting(selection, "#faa");
        break;
      case "3":
        addHighlighting(selection, "#afa");
        break;
      case "4":
        addHighlighting(selection, "#aaf");
        break;
      default:
        console.log("Key not recognized:", key);
        break;
    }
  });

  render();
}
