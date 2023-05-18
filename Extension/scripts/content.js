// Insert the button at the top of the page
var button = document.createElement('button');
button.textContent = 'Click Me';

// Create an Audio element

var paragraphs = document.querySelectorAll('p, article');

// Extract the text content from each paragraph/article element
var contents = Array.from(paragraphs).map(function(element) {
  return element.textContent.trim();
});

const StrContent = JSON.stringify(contents);

console.log(typeof(StrContent));

// Output the extracted contents
console.log('Paragraph and Article Contents:', contents);

const source = "http://api.voicerss.org/?key=ca4afd005154457a96cda353d9578493&hl=en-us&src=";

// Add a click event listener to the button
let currentAudio = null;

button.addEventListener('click', async function() {
  if (currentAudio && !currentAudio.paused) {
    // Audio is already playing, pause it
    currentAudio.pause();
    return;
  }

  for (var i = 0; i < StrContent.length; i += 500) {
    var chunk = StrContent.substring(i, i + 500);
    chunk = chunk.replace(/\\t|\\n/g, '');
    console.log('Chunk:', chunk);
    await test(chunk);
  }
});

function test(chunk) {
  return new Promise(resolve => {
    const audio = new Audio("http://api.voicerss.org/?key=ca4afd005154457a96cda353d9578493&hl=en-us&src=" + chunk);
    currentAudio = audio; // Store reference to the current audio
    audio.play();
    audio.onended = resolve;
  });
}

// Insert the button at the top of the page
var body = document.getElementsByTagName('body')[0];
body.insertBefore(button, body.firstChild);

// Exclude the form if it contains search elements
const forms = Array.from(document.querySelectorAll('form')).filter((form) => {
  const searchElements = Array.from(form.querySelectorAll('input')).filter((element) => {
    return element.classList.contains('searchButton') || element.getAttribute('name') == 'search';
  });
  return searchElements.length === 0;
});

// Check the remaining forms
forms.forEach((form) => {
  // Retrieve the form elements
  const formElements = form.querySelectorAll('input');
  // Identify the form type based on its CSS classes
  let formType = '';
  if (form.classList.contains('login-form')) {
    formType = 'login';
  } else if (form.classList.contains('sign-up-form')) {
    formType = 'sign-up';
  } else if (form.classList.contains('registration-form')) {
    formType = 'registration';
  } else if (form.classList.contains('subscribe-form')) {
    formType = 'subscription';
  } else {
    formType = 'filling';
  }
  // Create the summary
  let summary = `This form is for ${formType} and requires the following information: `;
  const formFields = Array.from(formElements).map((element) => {
    const fieldLabel = element.previousElementSibling?.textContent.trim();
    const fieldType = element.getAttribute('type');
    let exampleValue = '';
    if (fieldType === 'checkbox') {
      // For checkboxes, include the name and state (checked/unchecked)
      return fieldLabel + ': ' + (element.checked ? 'Checked' : 'Unchecked');
    } else {
      if (fieldLabel && fieldLabel !== 'Example Hidden') {
        // Use the text label as the field description
        return fieldLabel;
      } else if (element.getAttribute('placeholder') && element.getAttribute('placeholder') !== 'Example Hidden') {
        // Use the placeholder text as the field description if available and not 'Example Hidden'
        return element.getAttribute('placeholder');
      } else {
        // For other types, fall back to a generic example value based on the field type
        return ' ';
      }
    }
  });

  summary += formFields.join(' ');
  // Creating the summary element
  const summaryElement = document.createElement('p');
  summaryElement.textContent = summary;
  // Insert the summary element before the form
  form.insertAdjacentElement('beforebegin', summaryElement);
});




const SimgURLs = [...document.querySelectorAll("img")].map(img => img.dataset?.original ?? img.src);


const imgURLs2 = ['https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/181px-Cat_August_2010-4.jpg'];

console.log("hello" + JSON.stringify(SimgURLs));

const png = /.*.png/g;
const jpeg = /.*jpeg/g;
const jpg = /.*jpg/g;
const svg = /.*svg.*/g;
const icon_remove = /.*icon.*/g;

let data_urls = "[ \n";

const urlRegex = /(https?:\/\/.*\.(?:jpeg|jpg|png))/i;

let imgURLs = [];

//URL sanitizer
for (let i = 0; i < SimgURLs.length; i++) {

  const urls = SimgURLs[i].match(urlRegex);

  if (urls != null) {
    imgURLs.push(SimgURLs[i]);
    console.log("url is: " + SimgURLs[i]);
  }
}





// Add caption and ocr below the image
function add_caption_below_image(data) {
  const caption = "Image Desc: " + data.caption;
  if (data.ocr != '') {
    const ocr = "Image Contents: " + data.ocr;
    const ocr_element = document.createElement("p");
    const ocr_text_node = document.createTextNode(ocr);
    ocr_element.appendChild(ocr_text_node);
  }
  console.log(caption);
  const src = data.url;
  console.log(src);
  img_element = document.querySelector(`img[src="${src}"]`);
  if (!img_element) return;
  const captionBox = document.createElement('div');
  console.log(img_element);
  let parent_element = img_element.parentNode;
  console.log(parent_element);
  const caption_element = document.createElement("p");
  const caption_text_node = document.createTextNode(caption);
  caption_element.appendChild(caption_text_node);
  captionBox.appendChild(caption_element);
  if (data.ocr != '') captionBox.appendChild(ocr_element);
  console.log(captionBox);
  parent_element.parentNode.insertBefore(captionBox, parent_element.nextSibling);
}

const Server_url = "http://localhost:8888/predict/";
function processImages(imgUrls) {
  // Send a POST request to the API with the image sources
  $.ajax({
    url: Server_url,
    method: 'POST',
    contentType: 'application/json',
    data: "" + imgUrls + "",
    success: function (data) {
      for (let i = 0; i < data.length; i++) {
        add_caption_below_image(data[i]);
        console.log(data[i].caption);
        console.log(data[i].ocr);
      }
    },
    error: function (xhr) {
      alert('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
      console.error('Error:', xhr);
    }
  });
}
// Call the processImages function to send the image sources to the API
for (let i = 0; i < imgURLs.length; i++) {
  data_urls += ' { \"url\": \"' + imgURLs[i] + '\" }';
  if (i != imgURLs.length - 1) {
    data_urls += ",";
  }
  data_urls += "\n";
  if (i == imgURLs.length - 1) {
    data_urls += ']';
  }
}
console.log(data_urls);
processImages(data_urls);
