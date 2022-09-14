import { Router } from 'express';
import IndexController from '@controllers/index.controller';
//import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
//import validationMiddleware from '@middlewares/validation.middleware';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  public IndexController = new IndexController();

  // constructor() {
  //   this.initializeRoutes();
  // }

  private initializeRoutes() {
    this.router.get(`${this.path}gethoroscope`, IndexController.gethoroscope);
    this.router.get(`${this.path}getpanchang`, IndexController.getpanchang);
    //this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
    // this.router.delete(`${this.path}/:id(\\d+)`, this.usersController.deleteUser);
  }
}

export default IndexRoute;
