import {Router, Request, Response, NextFunction} from 'express';

import {render, errorMiddleware} from '../common/router';
import User from './users.model';

const router = Router();

router.use(errorMiddleware)

router.get('/users', (req: Request, res: Response, next: NextFunction) => {
    User.find().then(render(res, next)).catch(next)
});


router.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    User.findById(id).then(render(res, next)).catch(error => next(error))
})

router.post('/users', (req: Request, res: Response, next: NextFunction) => {
   const user = new User(req.body);

    user.save()
    .then(render(res, next))
    .catch(error => next(error))
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
    .then(render(res, next))
    .catch(error => next(error));
})

router.patch('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;
    const user = new User({_id, ...req.body});

    User.findByIdAndUpdate(
        _id,
        user,
        {new: true, useFindAndModify: false, runValidators: true, multipleCastError: true }
    )
    .then(render(res, next))
    .catch(error => next(error));
});

router.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.id;

    User.remove({_id}).then(result => {
        if(result.deletedCount) {
            res.json({message: 'User removido com sucesso!'})
        } else {
            res.status(404).json({message: 'User não encontrado!'})
        }
    }).catch(error => next(error));
})

export default router;