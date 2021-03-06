import { ValidationComposite, RequiredFieldValidation, Validation } from '../../../../presentation/protocols/validation/validators'

export const makeLoginValidation = (): ValidationComposite => {
    
    const validations: Validation[] = []
    
    for (const field of ['username', 'password']) {
        
        validations.push(new RequiredFieldValidation(field))
        
    }
    
    return new ValidationComposite(validations)
}
