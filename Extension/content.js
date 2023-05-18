//Exclude the form if it contains search elements
const forms=Array.from(document.querySelectorAll('form')).filter((form) => {
    const searchElements = Array.from(form.querySelectorAll('input')).filter((element) => {
      return element.classList.contains('searchButton')||element.getAttribute('name')==='search';
    });
    return searchElements.length === 0;
  });
  
  //check the remaining forms
  forms.forEach((form)=>{
    //Retrieve the form elements
    const formElements = form.querySelectorAll('input');
    //Identifying the form type
    let formType='';
    if (form.classList.contains('login-form')) {
      formType='login';
    } else if (form.classList.contains('sign-up-form')) {
      formType='sign-up';
    } else if (form.classList.contains('registration-form')) {
      formType='registration';
    } else if (form.classList.contains('subscribe-form')) {
        formType='Subscribe';
    } else {
      formType='filling';
    }
  
    //making the summary
    let summary=`It is a ${formType} form and requires you to fill in the following details: `;
    const formFields=Array.from(formElements).map((element)=>element.getAttribute('name'));
    summary+=formFields.join(',');
  
    // summaryy
    const summaryElement=document.createElement('p');
    summaryElement.textContent=summary;
    form.insertAdjacentElement('beforebegin',summaryElement);
  });
  
