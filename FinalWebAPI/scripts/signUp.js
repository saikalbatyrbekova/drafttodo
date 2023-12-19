// Get references to HTML elements using their IDs
const signUpForm = document.getElementById('signUpForm')
const userNameInput = document.getElementById('userNameInput')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')

// Define the URL for the API and the next page to redirect to after sign-up
const nextPage = '/signIn.html'
const BASE_URL = 'https://658194e23dfdd1b11c43a72e.mockapi.io/user'

// Function to validate the form inputs
const validate = () => {
    // Check if all input fields have values
    if (userNameInput.value && emailInput.value && passwordInput.value) {
        // If all fields have values, return true (indicating the form is valid)
        return true
    } else {
        // If any field is empty, add an 'error' class to highlight the error
        !userNameInput.value ? userNameInput.classList.add('error') : userNameInput.classList.remove('error')
        !emailInput.value ? emailInput.classList.add('error') : emailInput.classList.remove('error')
        !passwordInput.value ? passwordInput.classList.add('error') : passwordInput.classList.remove('error')
    }
}

// Function to asynchronously sign up the user
const asyncSignUp = async () => {
    try {
        // Make a POST request to the API with user data
        const response = await fetch(`${BASE_URL}`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userNameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
            })
        })
        // Return the JSON response from the API
        return response.json()
    }
    catch (e) {
        // Log any errors that occur during the API request
        console.log('Error:', e)
    }
}

// Event listener for form submission
signUpForm.onsubmit = event => {
    // Prevent the default form submission behavior
    event.preventDefault()

    // Validate the form inputs
    validate()
        // If the form is valid, call the asyncSignUp function and redirect to the next page
        ? asyncSignUp().then(() => window.location.href = nextPage)
        // If the form is not valid, show an alert indicating an error in sign-up
        : alert('Error in SignUp! Please fill out all fields.')
}
