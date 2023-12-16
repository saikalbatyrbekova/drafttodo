const signInForm = document.getElementById('newSignUpForm')
const userNameInput = document.getElementById('newUserNameInput')
const emailInput = document.getElementById('newEmailInput')
const passwordInput = document.getElementById('newPasswordInput')

const BASE_URL_two = 'https://656db53ebcc5618d3c23cb54.mockapi.io/todo/something/user'






signInForm.addEventListener('submit', (event) => {
    event.preventDefault()



    userNameInput.classList.remove('error-border')
    emailInput.classList.remove('error-border')
    passwordInput.classList.remove('error-border')

    if (!userNameInput.value.trim() || !emailInput.value.trim() || !passwordInput.value.trim()) {
        if (!userNameInput.value.trim()) {
            userNameInput.classList.add('error-border')
        }
        if (!emailInput.value.trim()) {
            emailInput.classList.add('error-border')
        }
        if (!passwordInput.value.trim()) {
            passwordInput.classList.add('error-border')
        }
        return
    }

    const request = new XMLHttpRequest()
    request.open('GET', `${BASE_URL_two}`)
    request.setRequestHeader('Content-type', 'application/json')
    request.send()
    request.addEventListener('load', () => {
        const data = JSON.parse(request.response)
        let found = false;

        for (let i = 0; i < data.length; i++) {
            const dataInfo = data[i]
            if (
                userNameInput.value === dataInfo.username &&
                emailInput.value === dataInfo.email &&
                passwordInput.value === dataInfo.password
            ) {
                found = true;
                window.location.href = '/taskmanager.html'
                localStorage.setItem('user_id', dataInfo.id)
            }
        }

        if (!found) {
            userNameInput.classList.add('error-border')
            emailInput.classList.add('error-border')
            passwordInput.classList.add('error-border')
        }
    })
})