import { Router, Request, Response } from "express";
import { IsAuth } from "../../middlewares/Middlewares";
import { getGuildController } from "../../controllers/guilds/GuildControllers";


class GuildsRouter {
    public router: Router;
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get("/", IsAuth, getGuildController);
    }

    private getHello(req: Request, res: Response) {
        res.json({ message: "Hello World" });
    }
}

const guildsRouter = new GuildsRouter();
export default guildsRouter.router;