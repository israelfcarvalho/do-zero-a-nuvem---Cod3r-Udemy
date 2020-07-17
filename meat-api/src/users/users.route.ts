import {Router, Request, Response, NextFunction, application} from 'express';

import User from './users.model';

const router = Router();

router.get('/users', (req: Request, res: Response, next: NextFunction) => {
    User.find().then(users => {
        res.json(users)
    })
});


router.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    User.findById(id).then(user => {
        if(user) {
            res.json(user);
        }

        res.send(404);  
    })
})

router.post('/users', (req: Request, res: Response, next: NextFunction) => {
   const user = new User(req.body);

    user.save()
    .then(user => {
        res.json(user);
    })
    .catch(error => {
        console.error({error});

        const errors = error.errors;
        const errorKeys = Object.keys(error.errors)
        const errorObject: any = {error: {}}
        
        errorKeys.forEach(key => {
            errorObject.error[key] = errors[key].properties.message;
        })

        res.json(errorObject);
    })
})

router.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const user = new User({_id, ...req.body});
    
    const update = user.getPutUpdate();

    User.findByIdAndUpdate(
        _id,
        update,
        {new: true, useFindAndModify: false, multipleCastError: true, runValidators: true}
    )
    .then(user => {
        if(user) {
            res.json(user)
        } else {
            res.sendStatus(404);
        }
    })
    .catch(error => {
        console.error({error});
        const errors = error.errors;
        const errorKeys = Object.keys(error.errors)
        const errorObject: any = {error: {}}
        
        errorKeys.forEach(key => {
            errorObject.error[key] = errors[key].properties.message;
        })

        res.json(errorObject);
    })
})

router.patch('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const user = new User({_id, ...req.body});

    User.findByIdAndUpdate(
        _id,
        user,
        {new: true, useFindAndModify: false, runValidators: true, multipleCastError: true }
    ).then(user => {
        if(user) {
            res.json(user)
        } else {
            res.sendStatus(404);
        }
    }).catch(error => {
        console.error({error});
        const errors = error.errors;
        const errorKeys = Object.keys(error.errors)
        const errorObject: any = {error: {}}
        
        errorKeys.forEach(key => {
            errorObject.error[key] = errors[key].properties.message;
        })

        res.json(errorObject);
    })
});

router.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;

    User.remove({_id}).then(result => {
        if(result.deletedCount) {
            res.json({message: 'User removido com sucesso!'})
        } else {
            res.status(404).json({message: 'User não encontrado!'})
        }
    }).catch(error => {
        console.log({error})

        res.sendStatus(404);
    })
})

export default router;