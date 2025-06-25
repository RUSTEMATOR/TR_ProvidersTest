import {APIRequestContext, expect } from "playwright/test"


export default class AuthController {

    private request: APIRequestContext;
    private GET_JWT_TOKEN_PATH = "https://tombriches.com/api/front/auth"
    private LOGIN_PATH = "https://tombriches.com/api/auth/login"
 

    constructor(request: APIRequestContext) {
        this.request = request
    }
    
    async getJwtToken() {
        const response = await this.request.get(this.GET_JWT_TOKEN_PATH)
        const jwtToken = await response.json()
        return jwtToken.jwt
    }

    async logIn(JWT, userEmail, userPassword ) {
        const loginResponse = await this.request.post(this.LOGIN_PATH, {
            headers: {
                'Authorization': `Bearer ${JWT}`
            },

            data: {
                email: userEmail,
                password: userPassword, 
                language: 'en'
            }
        })

        expect(loginResponse).toBeOK()

        const userInfo = await loginResponse.json()


        
        console.log(userInfo)
        return userInfo
    }
}