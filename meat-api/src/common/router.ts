import {NextFunction, Response} from 'express';
import {User} from '../users/users.model';

type Document = User | User[] | null | undefined

export const render = function(res: Response, next: NextFunction){
    return (document: Document) => {
        if(document){
            res.json(document);
        } else {
            res.send(404);
        }

        return next()
    }
}