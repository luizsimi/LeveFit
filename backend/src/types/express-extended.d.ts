import "express";
import { RequestHandler } from "express";

declare module "express" {
  interface Router {
    get(path: string, handler: RequestHandler): this;
    post(path: string, handler: RequestHandler): this;
    put(path: string, handler: RequestHandler): this;
    delete(path: string, handler: RequestHandler): this;
    use(handler: RequestHandler): this;
    use(path: string, handler: RequestHandler): this;
  }
}
