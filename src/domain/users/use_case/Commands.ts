import { Wrapper, wrapperData, wrapperError } from '../../../helper/wrapper/wrapper';
import { Commands } from '../repositories/Commands';
import { Queries } from '../repositories/Queries';
import { User } from '../schemas/Model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../../helper/config/globalConfig';

interface IuserUcCommands {
    save(user: User): Promise<Wrapper>;
    update(user: User): Promise<Wrapper>;
    delete(userId: number): Promise<Wrapper>;
    login(user: User): Promise<Wrapper>
}

export class UcCommand implements IuserUcCommands {
  private command: Commands;
  private query: Queries;

  constructor (){
    this.command = new Commands();
    this.query = new Queries();
  }
  
  async save(user: User): Promise<Wrapper> {        
    user.password = await bcrypt.hash(user.password, 8);
    const err = await this.command.save(user);
    if (err) {
      return wrapperError(400, err);  
    }
    return wrapperData(200);
  }

  async update(user: User): Promise<Wrapper> {
    const new_user = await this.query.retrieveById(user.id);
    if (!new_user) {
      return wrapperError(404, new Error('users is not found'));  
    }
    const err = await this.command.update(user);
    if (err) {
      return wrapperError(404, err);  
    }
    return wrapperData(200);
  }
      
  async delete(userId: number): Promise<Wrapper> {
    const new_user = await this.query.retrieveById(userId);
    if (!new_user) {
      return wrapperError(404, new Error('users is not found'));  
    }
  
    await this.command.delete(userId);
    return wrapperData(200);
  }

  async login(user: User): Promise<Wrapper> {
    const new_user = await this.query.login(user.username);
    if (!new_user[0]) {
      return wrapperError(404, new Error('users is not found'));  
    }
    const passwordMatch = await bcrypt.compare(user.password, new_user[0]?.password);
    if (!passwordMatch) {
      return wrapperError(404, new Error('password invalid'));  
    }        

    const encode = jwt.sign({
      username: new_user[0].username,
    }, config.JWT_SECRET_KEY, 
    { 
      algorithm: 'HS256',
      expiresIn: '1h'
    } 
    );
    return wrapperData(200, encode);
  }
    
}