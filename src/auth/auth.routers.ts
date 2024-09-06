import { NextFunction, Request, Response, Router } from "express";
import { AuthService } from "./auth.service";
import { currentUser } from "@shopp-app-hsn/common";
const router = Router();

router.post(
  "/signUp",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const jwt = await AuthService.signUp({ email, password }, next);
    req.session = { jwt };
    res.status(201).send(true);
  }
);
router.post(
  "/signIn",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const jwt = await AuthService.signIn({ email, password }, next);
    req.session = { jwt };
    console.log(req.session.jwt);
    res.status(201).send(true);
  }
);
const key = process.env.JWT_KEY!;
console.log(key);
router.get(
  "/current-user",
  currentUser(process.env.JWT_KEY!),
  (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send(req.currentUser);
  }
);

export { router as authRouters };
