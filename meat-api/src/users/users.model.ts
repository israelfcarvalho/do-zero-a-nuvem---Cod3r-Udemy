interface IUser {
    id: number,
    name: string,
    email: string
}

const users: Array<IUser> = [
    {id: 1, name: 'Peter Parker', email: 'peter@marvel.com'},
    {id: 2, name: 'Bruce Wayne', email: 'bruce@dc.com'}

]

export default class User {
    static findAll(): Promise<Array<IUser>>{
        return Promise.resolve(users);
    }

    static findById(id: number): Promise<Array<IUser>> {
        return Promise.resolve(users.filter(user => user.id === id))
    }
}