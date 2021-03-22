import { prisma } from '../helpers/prisma-helper'
import { UserPostgreSQLRepository } from './user'

interface SutTypes {
    sut: UserPostgreSQLRepository
}

const makeSut = (): SutTypes => {
    
    const sut = new UserPostgreSQLRepository()
    
    return {
        sut
    }
    
}

describe('User PostgreSQL Repository', () => {
    
    afterAll(async () => {
        
        await prisma.user.deleteMany({
            where: {
                username: {
                    startsWith: '!'
                }
            }
        })
        
        await prisma.$disconnect()
    })
    
    test('Should return a user on success', async () => {
        
        const { sut } = makeSut()
        
        const user = await sut.add({
            username: '!1_any_username',
            birth_date: new Date('2021-02-28'),
            email: '_any_mail@email',
            name: '_any_name',
            password: '_any_password'
        })
        
        expect(user).toBeTruthy()
        expect(user.id).toBeTruthy()
        expect(user.username).toBe('!1_any_username')
        expect(user.birth_date.toISOString()).toBe(new Date('2021-02-28').toISOString())
        expect(user.email).toBe('_any_mail@email')
        expect(user.name).toBe('_any_name')
        expect(user.password).toBe('_any_password')
        
    })
    
    test('Should return a user if loadByUsername succeeds', async () => {
        
        const { sut } = makeSut()
        
        await prisma.user.create({
            data: {
                username: '!2_any_username',
                birth_date: new Date('2021-02-28'),
                email: '_any_mail1@email',
                name: '_any_name',
                password: '_any_password'                
            }
        })
        
        const user = await sut.loadByUsername('!2_any_username')
        
        expect(user).toBeTruthy()
        expect(user.id).toBeTruthy()
        expect(user.username).toBe('!2_any_username')
        expect(user.birth_date.toISOString()).toBe(new Date('2021-02-28').toISOString())
        expect(user.email).toBe('_any_mail1@email')
        expect(user.name).toBe('_any_name')
        expect(user.password).toBe('_any_password')
        
    })    
    
})
