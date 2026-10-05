document.addEventListener('DOMContentLoaded', () => {
            const form = document.getElementById('sssRegistrationForm');
            const ssNumber = document.getElementById('ssNumber');
            const email = document.getElementById('email');
            const confirmEmail = document.getElementById('confirmEmail');
            const userId = document.getElementById('userId');
            const confirmUserId = document.getElementById('confirmUserId');
            const lastName = document.getElementById('lastName');
            const firstName = document.getElementById('firstName');
            const dob = document.getElementById('dob');
            const houseLot = document.getElementById('houseLot');
            const street = document.getElementById('street');
            const subdivision = document.getElementById('subdivision');
            const termsConsent = document.getElementById('termsConsent');
            const resetBtn = document.getElementById('resetBtn');

            
            const successModal = document.getElementById('successModal');
            const closeModalBtn = document.getElementById('closeModalBtn');
            const modalEmail = document.getElementById('modalEmail');

            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            const userIdRegex = /^[a-zA-Z][a-zA-Z0-9_]{7,19}$/;
            const forbiddenCharsRegex = /[#%()\\'\*\|<>\/]/;

            // Helper to show/hide validation states
            function setFieldStatus(input, errorEl, isValid) {
                if (isValid) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                    if (errorEl) errorEl.classList.add('hidden');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    if (errorEl) errorEl.classList.remove('hidden');
                }
                return isValid;
            }

            function clearFieldStatus(input, errorEl) {
                input.classList.remove('is-valid', 'is-invalid');
                if (errorEl) errorEl.classList.add('hidden');
            }

            // Real-time SS Number Formatter & Validator
            ssNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\d-]/g, '');
                e.target.value = value;
                const cleanValue = value.replace(/-/g, '');
                
                // Check if length is 10 digits (SS) or 12 digits (CRN)
                const isValid = (cleanValue.length === 10 || cleanValue.length === 12);
                if (cleanValue.length > 0) {
                    setFieldStatus(ssNumber, document.getElementById('ssNumberError'), isValid);
                } else {
                    clearFieldStatus(ssNumber, document.getElementById('ssNumberError'));
                }
            });

            // Real-time Email Validation
            email.addEventListener('input', () => {
                const isValid = emailRegex.test(email.value.trim());
                if (email.value.length > 0) {
                    setFieldStatus(email, document.getElementById('emailError'), isValid);
                } else {
                    clearFieldStatus(email, document.getElementById('emailError'));
                }

                if (confirmEmail.value.length > 0) {
                    const match = email.value.trim() === confirmEmail.value.trim();
                    setFieldStatus(confirmEmail, document.getElementById('confirmEmailError'), match);
                }
            });

            confirmEmail.addEventListener('input', () => {
                const match = email.value.trim() === confirmEmail.value.trim() && emailRegex.test(confirmEmail.value.trim());
                if (confirmEmail.value.length > 0) {
                    setFieldStatus(confirmEmail, document.getElementById('confirmEmailError'), match);
                } else {
                    clearFieldStatus(confirmEmail, document.getElementById('confirmEmailError'));
                }
            });

            // Real-time User ID Validation
            userId.addEventListener('input', () => {
                const val = userId.value;
                const hasForbidden = forbiddenCharsRegex.test(val);
                const isValid = userIdRegex.test(val) && !hasForbidden;

                if (val.length > 0) {
                    setFieldStatus(userId, document.getElementById('userIdError'), isValid);
                } else {
                    clearFieldStatus(userId, document.getElementById('userIdError'));
                }

                if (confirmUserId.value.length > 0) {
                    const match = userId.value === confirmUserId.value;
                    setFieldStatus(confirmUserId, document.getElementById('confirmUserIdError'), match);
                }
            });

            confirmUserId.addEventListener('input', () => {
                const match = userId.value === confirmUserId.value && userIdRegex.test(confirmUserId.value);
                if (confirmUserId.value.length > 0) {
                    setFieldStatus(confirmUserId, document.getElementById('confirmUserIdError'), match);
                } else {
                    clearFieldStatus(confirmUserId, document.getElementById('confirmUserIdError'));
                }
            });

            // Form Submit Event
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Validate all required fields
                const cleanSS = ssNumber.value.replace(/-/g, '');
                const isSsValid = setFieldStatus(ssNumber, document.getElementById('ssNumberError'), (cleanSS.length === 10 || cleanSS.length === 12));
                
                const isEmailValid = setFieldStatus(email, document.getElementById('emailError'), emailRegex.test(email.value.trim()));
                const isConfirmEmailValid = setFieldStatus(confirmEmail, document.getElementById('confirmEmailError'), (confirmEmail.value.trim() === email.value.trim() && isEmailValid));

                const isUserIdValid = setFieldStatus(userId, document.getElementById('userIdError'), (userIdRegex.test(userId.value) && !forbiddenCharsRegex.test(userId.value)));
                const isConfirmUserIdValid = setFieldStatus(confirmUserId, document.getElementById('confirmUserIdError'), (confirmUserId.value === userId.value && isUserIdValid));

                const isLastNameValid = setFieldStatus(lastName, document.getElementById('lastNameError'), lastName.value.trim() !== '');
                const isFirstNameValid = setFieldStatus(firstName, document.getElementById('firstNameError'), firstName.value.trim() !== '');
                const isDobValid = setFieldStatus(dob, document.getElementById('dobError'), dob.value !== '');

                const isHouseLotValid = setFieldStatus(houseLot, document.getElementById('houseLotError'), houseLot.value.trim() !== '');
                const isStreetValid = setFieldStatus(street, document.getElementById('streetError'), street.value.trim() !== '');
                const isSubdivisionValid = setFieldStatus(subdivision, document.getElementById('subdivisionError'), subdivision.value.trim() !== '');

                const isTermsValid = termsConsent.checked;
                const termsError = document.getElementById('termsError');
                if (!isTermsValid) {
                    termsError.classList.remove('hidden');
                } else {
                    termsError.classList.add('hidden');
                }

                const allValid = isSsValid && isEmailValid && isConfirmEmailValid && isUserIdValid && 
                                 isConfirmUserIdValid && isLastNameValid && isFirstNameValid && 
                                 isDobValid && isHouseLotValid && isStreetValid && isSubdivisionValid && isTermsValid;

                if (allValid) {
                    // Show modal confirmation
                    modalEmail.textContent = email.value.trim();
                    successModal.classList.remove('hidden');
                } else {
                    // Scroll to first error
                    const firstInvalid = document.querySelector('.is-invalid, #termsConsent:invalid');
                    if (firstInvalid) {
                        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });

            // Reset Handler
            resetBtn.addEventListener('click', () => {
                form.reset();
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => {
                    clearFieldStatus(input, null);
                });
                document.querySelectorAll('[id$="Error"]').forEach(el => el.classList.add('hidden'));
            });

            // Modal Close Handler
            closeModalBtn.addEventListener('click', () => {
                successModal.classList.add('hidden');
                form.reset();
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => clearFieldStatus(input, null));
            });
        });
