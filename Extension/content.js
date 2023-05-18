// Exclude the form if it contains search elements
const forms = Array.from(document.querySelectorAll('form')).filter((form) => {
    const searchElements = Array.from(form.querySelectorAll('input')).filter((element) => {
      return element.classList.contains('searchButton') || element.getAttribute('name') === 'search';
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
      const fieldType = element.getAttribute('type');
      let fieldLabel = '';
      let exampleValue = '';
  
      if (fieldType === 'checkbox') {
        // For checkboxes, include the name and state (checked/unchecked)
        fieldLabel = element.getAttribute('name') + ': ' + (element.checked ? 'Checked' : 'Unchecked');
      } else {
        const placeholder = element.getAttribute('placeholder');
        if (placeholder && !placeholder.includes('data:image')) {
          // For regular input fields, use the placeholder value
          fieldLabel = placeholder;
        } else {
          // For other types, fall back to a generic example value based on the field type
          fieldLabel = element.getAttribute('name') || 'Example ' + fieldType;
        }
      }
  
      return fieldLabel;
    });
    summary += formFields.join(', ');
  
    // Create the summary element
    const summaryElement = document.createElement('p');
    summaryElement.textContent = summary;
  
    // Insert the summary element before the form
    form.insertAdjacentElement('beforebegin', summaryElement);
  });  
