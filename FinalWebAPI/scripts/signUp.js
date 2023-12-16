const signUpForm = document.getElementById('signUpForm')
const userNameInput = document.getElementById('userNameInput')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')

const nextPage = '/signIn.html'
const BASE_URL = 'https://656db53ebcc5618d3c23cb54.mockapi.io/todo/something/user'


const validate = () => {

    if (userNameInput.value && emailInput.value && passwordInput.value) return true
    else  {
        !userNameInput.value ? userNameInput.classList.add('error') : userNameInput.classList.remove('error')
        !emailInput.value ? emailInput.classList.add('error') : emailInput.classList.remove('error')
        !passwordInput.value ? passwordInput.classList.add('error') : passwordInput.classList.remove('error')
    }
}


const asyncSignUp = async () => {
    try {
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
        return response.json()
    }
    catch (e) {
        console.log()
    }
}


signUpForm.onsubmit = event => {
    event.preventDefault()

    validate()
        ? asyncSignUp().then(() => window.location.href = nextPage)
        : alert('Error of SignUp!')
}