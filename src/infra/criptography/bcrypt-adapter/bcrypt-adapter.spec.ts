import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash (): Promise<string> {
        return new Promise(resolve => resolve('hashed_value'))
    },
    
    async compare (): Promise<boolean> {
        return new Promise(resolve => resolve(true))
    }
}))

interface SutTypes {
    sut: BcryptAdapter
    SALT: number
}

const makeSut = (): SutTypes => {
    
    const SALT = 12
    
    const sut = new BcryptAdapter(SALT)
    
    return {
        sut,
        SALT
    }
    
}

describe('Bcrypt Adapter', () => {
    
    test('Should call bcrypt with corret value', async () => {
        
        const { sut, SALT } = makeSut()
        
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        
        await sut.hash('_any_value')
        
        expect(hashSpy).toHaveBeenCalledWith('_any_value', SALT)
        
    })
    
    test('Should return a hash on success', async () => {
        
        const { sut } = makeSut()
        
        const hash = await sut.hash('_any_value')
        
        expect(hash).toBe('hashed_value')
        
    })
    
    test('Should throw if hash throws', async () => {
        
        const { sut } = makeSut()
        
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        
        const promise = sut.hash('any_value')
        
        await expect(promise).rejects.toThrow()
        
    })    
    
    test('Should call compare with corret value', async () => {
        
        const { sut } = makeSut()
        
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        
        await sut.compare('_any_value', '_any_hash')
        
        expect(compareSpy).toHaveBeenCalledWith('_any_value', '_any_hash')
        
    })    
    
    test('Should return true when compare succeeds', async () => {
        
        const { sut } = makeSut()
        
        const isValid = await sut.compare('_any_value', '_any_hash')
        
        expect(isValid).toBe(true)
        
    })  
    
    test('Should return false when compare fails', async () => {
        
        const { sut } = makeSut()
        
        jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
        
        const isValid = await sut.compare('_any_value', '_invalid_hash')
        
        expect(isValid).toBe(false)
        
    })
    
    test('Should throw if compare throws', async () => {
        
        const { sut } = makeSut()
        
        jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
        
        const promise = sut.compare('any_value', '_any_hash')
        
        await expect(promise).rejects.toThrow()
        
    })    
    
})
