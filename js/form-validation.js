
document.addEventListener('DOMContentLoaded', function() {
    
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = document.querySelector('.btn-submit');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    function validateForm() {
        let isValid = true;
        
       
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Name is required';
            nameError.style.display = 'block';
            nameInput.classList.add('error');
            isValid = false;
        } else {
            nameError.style.display = 'none';
            nameInput.classList.remove('error');
        }
        
     
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email is required';
            emailError.style.display = 'block';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.display = 'block';
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailError.style.display = 'none';
            emailInput.classList.remove('error');
        }
        
       
        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Message is required';
            messageError.style.display = 'block';
            messageInput.classList.add('error');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            messageError.style.display = 'block';
            messageInput.classList.add('error');
            isValid = false;
        } else {
            messageError.style.display = 'none';
            messageInput.classList.remove('error');
        }
        
   
        submitButton.disabled = !isValid;
        
        return isValid;
    }
    
    
    nameInput.addEventListener('input', validateForm);
    emailInput.addEventListener('input', validateForm);
    messageInput.addEventListener('input', validateForm);
    

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
        
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            successMessage.style.color = '#10b981';
            successMessage.style.padding = '1rem';
            successMessage.style.marginTop = '1rem';
            successMessage.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            successMessage.style.borderRadius = '0.5rem';
            successMessage.style.textAlign = 'center';
            
            
            contactForm.appendChild(successMessage);
            
         
            contactForm.reset();
            
           
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
    });
    
    validateForm();
});