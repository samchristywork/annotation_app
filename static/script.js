var text_area = document.getElementById("text_area");
var root = document.getElementById("root");
var highlight_controls = document.getElementById("highlight_controls");
var modal = document.getElementById("modal");
var submit_button = document.getElementById("submit");
var modal_text = document.getElementById("modal-text");
var modal_cancel = document.getElementById("modal-cancel");
var modal_ok = document.getElementById("modal-ok");
var modal_title = document.getElementById("modal-title");
submit_button.focus();

var body_text = "";
body_text += "Metronomic or arranged rolls are rolls produced by positioning the music slots without real-time input from a performing musician. The music, when played back, is typically purely metronomical. Metronomically arranged music rolls are deliberately left metronomic so as to enable a player-pianist to create their own musical performance (such as varying the dynamics, tempo, and phrasing) via the hand controls that are a feature of all player pianos.\n\n";
body_text += "Hand played rolls are created by capturing in real time the hand-played performance of one or more pianists upon a piano connected to a recording machine. The production roll reproduced the real-time performance of the original recording when played back at a constant speed. (It became industry convention for recordings of music intended to be used for dancing to be regularized into strict tempo despite the original performance having the slight tempo fluctuations of all human performances, as due to the recording and production process, any fluctuations would be magnified/exaggerated in the finished production copy and result in an uneven rhythm.)\n\n";
body_text += `Reproducing rolls are the same as hand-played rolls but have additional control codes to operate the dynamic modifying systems specific to whichever brand of reproducing piano it is designed to be played back on, producing an approximation of the original recording pianist's dynamics. Reproducing pianos were beyond the reach of the average home in the original era of popularity of these instruments and were heavily marketed as reproducing the 'soul' of the performer – slogans such as "The Master's Fingers On Your Piano" or "Paderewski will play for you in your own house!" were common.\n\n`;
body_text += `Wikipedia contributors. (2023, July 26). Piano roll. In Wikipedia, The Free Encyclopedia. Retrieved 19:34, November 4, 2023, from https://en.wikipedia.org/w/index.php?title=Piano_roll&oldid=1167168161`;

text_area.value = body_text;

var highlights = [];

function closeModal() {
  modal.classList.add("hidden");
}

function openModal(title, message, yes, no) {
  modal_title.innerHTML = title;
  modal_text.innerHTML = message;
  modal.classList.remove("hidden");

  modal_ok.onclick = function() {
    closeModal();
    yes();
  }

  modal_cancel.onclick = function() {
    closeModal();
    no();
  }
}

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
  let choice = openModal("Delete", "Delete this highlight?",
    () => {
      var selection = window.getSelection();
      if (selection.type === 'Range' && selection.toString().length > 0) {
      } else {
        highlights.splice(index, 1);
        render();
      }
    }, () => {
    }
  );
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
  html += '<p class="centered">With text selected, press 1, 2, 3, or 4 to highlight the text with a color. ';
  html += 'A highlight can be deleted by clicking on it.</p>';
  html += '<div class="annotated_text" id="annotated_text">';

  //console.log("Highlights:");
  //for (let i = 0; i < highlights.length; i++) {
  //  console.log(highlights[i].start, highlights[i].end, highlights[i].color);
  //}

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
    let annotated_text = document.getElementById("annotated_text");
    let selection = getSelectionCharacterOffsetWithin(annotated_text);

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
