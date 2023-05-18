// Retrieve the form elements
const form = document.querySelector('form');
const formElements = form.querySelectorAll('input');

// Identify the form type
let formType = '';
if (form.classList.contains('login-form')) {
  formType = 'login';
} else if (form.classList.contains('sign-up-form')) {
  formType = 'sign-up';
} else if (form.classList.contains('registration-form')) {
  formType = 'registration';
} else {
  formType = 'form filling';
}

// Generate the form summary
let summary = `The form below is a ${formType} form and requires you to fill in the following details: `;
const formFields = Array.from(formElements).map((element) => element.getAttribute('name'));
summary += formFields.join(', ');

// Display the summary
const summaryElement = document.createElement('p');
summaryElement.textContent = summary;
form.insertAdjacentElement('beforebegin', summaryElement);