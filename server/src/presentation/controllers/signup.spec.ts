import { SignUpController } from './signup'
import { MissingParamsError } from '../errors/missing-params-error'

const makeSut = (): SignUpController => {
    return new SignUpController()
}

describe('SignUp Controller', () => {

    test('Should return 400 if no username is provided', () => {

        const sut = makeSut()

        const httpRequest = {
            body: {
                email: '_any@email',
                birth_date: '2021-02-28',
                name: '_any_name',
                password: '_any_password',
                passwordConfirm: '_any_passwordConfirm'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamsError('username'))

    })

    test('Should return 400 if no email is provided', () => {

        const sut = makeSut()

        const httpRequest = {
            body: {
                username: '_any_username',
                birth_date: '2021-02-28',
                name: '_any_name',
                password: '_any_password',
                passwordConfirm: '_any_passwordConfirm'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamsError('email'))

    })

})
