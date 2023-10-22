import { authHeader } from '../helpers/auth-header';

export const userService = {
    login,
    logout,
    getAll
};

/**
 * Попытка авторизации 
 * 
 * @param {*} username 
 * @param {*} password 
 * @returns 
 */
function login(username, password)
{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, password })
    };

    return fetch(`/auth`, requestOptions)
        .then(handleResponse)
        .then(response =>
        {
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
}

function logout()
{
    localStorage.removeItem('user');
}

async function getAll()
{
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    return await fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response)
{
    return response.json().then(jsonData =>
    {
        const data = jsonData;
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}