// Retrieve the form elements
const forms = document.querySelectorAll('form');

// Create an array to store form summaries
const formSummaries = [];

// Loop through each form
forms.forEach((form) => {
// Exclude the search button
const formElements = Array.from(form.querySelectorAll('input')).filter((element) => {
    return !element.classList.contains('searchButton') && element.getAttribute('name') !== 'search';
  });  

  // Identify the form type
  let formType = '';
  if (form.classList.contains('formFillingForm')) {
    formType = 'form filling';
  } else if (form.classList.contains('loginForm')) {
    formType = 'login';
  }

  // Generate the form summary
  let summary = `The ${formType} form requires you to fill in the following details: `;
  const formFields = formElements.map((element) => element.getAttribute('name'));
  summary += formFields.join(', ');

  // Store the form summary
  formSummaries.push(summary);
});

// Create a container element for the summaries
const summaryContainer = document.createElement('div');

// Loop through each form summary and create a summary element
formSummaries.forEach((summary) => {
  const summaryElement = document.createElement('p');
  summaryElement.textContent = summary;
  summaryContainer.appendChild(summaryElement);
});

// Insert the summary container after the form filling form
const formFillingForm = document.querySelector('.formFillingForm');
if (formFillingForm) {
  formFillingForm.insertAdjacentElement('afterend', summaryContainer);
} else {
  document.body.prepend(summaryContainer);
}

// Insert the summary container after the login form
const loginForm = document.querySelector('.loginForm');
if (loginForm) {
  loginForm.insertAdjacentElement('afterend', summaryContainer.cloneNode(true));
}
