import { UserModel } from "../../../domain/models/user"
import { LoadUserByUsernameRepository } from "../../../data/protocols/repository/load-user-by-username"
import { DbAuthentication } from './db-authentication'
import { HashCompare } from '../../../data/protocols/cripotagraphy/hash-compare'
import { TokenGenerator } from '../../../data/protocols/cripotagraphy/token-generator'

const makeLoadUserByUsernameRepository = (): LoadUserByUsernameRepository => {
    
    class LoadUserByUsernameRepositoryStub implements LoadUserByUsernameRepository {
        async load (username: string): Promise<UserModel> {
            
            const user: UserModel = {
                id: '_valid_id',
                username: 'thdq',
                birth_date: new Date('2021-03-21'),
                email: '_valid@email',
                name: '_any_name',
                password: '_hashed_password'
            }
            
            return new Promise(resolve => resolve(user))
        }
    }
    
    return new LoadUserByUsernameRepositoryStub()
}

const makeHashCompare = (): HashCompare => {
    
    class HashCompareStub implements HashCompare {
        async compare (value: string, hash: string): Promise<boolean> {
            
            return new Promise(resolve => resolve(true))
        }
    }
    
    return new HashCompareStub()
}

const makeTokenGenerator = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
        async generate (id: string): Promise<string> {
            
            return new Promise(resolve => resolve('_any_token'))
        }
    }
    
    return new TokenGeneratorStub()
}

interface SutTypes {
    sut: DbAuthentication
    loadUserByUsernameRepositoryStub: LoadUserByUsernameRepository
    hashCompareStub: HashCompare
    tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
    
    const loadUserByUsernameRepositoryStub = makeLoadUserByUsernameRepository()
    
    const hashCompareStub = makeHashCompare()
    
    const tokenGeneratorStub = makeTokenGenerator()
    
    const sut = new DbAuthentication(loadUserByUsernameRepositoryStub, hashCompareStub, tokenGeneratorStub)
    
    return {
        sut,
        loadUserByUsernameRepositoryStub,
        hashCompareStub,
        tokenGeneratorStub
    }
}

describe('DbAuthentication UseCase', () => {
    
    test('Should call LoadUserByUsernameRepository with correct username', async () => {
        
        const { sut, loadUserByUsernameRepositoryStub } = makeSut()
        
        const loadSpy = jest.spyOn(loadUserByUsernameRepositoryStub, 'load')
        
        await sut.auth({
            username: 'thdq',
            password: '_any_password'
        })
        
        expect(loadSpy).toHaveBeenCalledWith('thdq')
        
    })
    
    test('Should throw if LoadUserByUsernameRepository throws', async () => {
        
        const { sut, loadUserByUsernameRepositoryStub } = makeSut()
        
        jest.spyOn(loadUserByUsernameRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        
        const promise = sut.auth({
            username: 'thdq',
            password: '_any_password'
        })
        
        await expect(promise).rejects.toThrow()
        
    })
    
    test('Should return null LoadUserByUsernameRepository returns null', async () => { 
        
        const { sut, loadUserByUsernameRepositoryStub } = makeSut()
        
        jest.spyOn(loadUserByUsernameRepositoryStub, 'load').mockReturnValueOnce(null)
        
        const accessToken = await sut.auth({
            username: 'thdq',
            password: '_any_password'
        })
        
        expect(accessToken).toBeNull()
        
    })
    
    test('Should call HashComparer with correct values', async () => {
        
        const { sut, hashCompareStub } = makeSut()
        
        const compareSpy = jest.spyOn(hashCompareStub, 'compare')
        
        await sut.auth({
            username: 'thdq',
            password: '_any_password'
        })
        
        expect(compareSpy).toHaveBeenCalledWith('_any_password', '_hashed_password')
        
    })  
    
    test('Should throw if HashComparer throws', async () => {
        
        const { sut, hashCompareStub } = makeSut()
        
        jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        
        const promise = sut.auth({
            username: 'thdq',
            password: '_any_password'
        })
        
        await expect(promise).rejects.toThrow()
        
    })    
    
    test('Should return null HashComparer returns false', async () => { 
        
        const { sut, hashCompareStub } = makeSut()
        
        jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        
        const accessToken = await sut.auth({
            username: 'thdq',
            password: '_any_password'
        })
        
        expect(accessToken).toBeNull()
        
    })    
    
    test('Should call TokenGenerator with correct id', async () => {
        
        const { sut, tokenGeneratorStub } = makeSut()
        
        const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
        
        await sut.auth({
            username: 'thdq',
            password: '_any_password'
        })
        
        expect(generateSpy).toHaveBeenCalledWith('_valid_id')
        
    })      
    
})
