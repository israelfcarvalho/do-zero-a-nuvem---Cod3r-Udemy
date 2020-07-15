import {Server} from './server';
import { environment } from './common/environment';

const server = new Server();

server.bootstrap()
  .then((server) => {
    console.log("Server is listening on port:", environment.server.port)
  })
  .catch(error => {
    console.log("Server failed to start!");
    console.error(error)
  
    process.exit(1);
  })