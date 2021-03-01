import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest } from '../helpers/http'
import { MissingParamsError } from '../errors/missing-params-error'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/validator/email-validator'
import { InvalidParamsError } from '../errors/invalid-params-error'

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle (httpRequest: HttpRequest): HttpResponse {

        const requiredFields = ['name', 'email', 'password', 'passwordConfirm', 'birth_date', 'username']

        for (const field of requiredFields) {

            if (!httpRequest.body[field]) return badRequest(new MissingParamsError(field))

        }

        const isValid = this.emailValidator.isValid(httpRequest.body.email)

        if (!isValid) return badRequest(new InvalidParamsError('email'))

    }

}
