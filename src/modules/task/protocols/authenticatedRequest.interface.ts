import { PayloadInterface } from "src/modules/auth/protocols/interfaces/payload.interface";

export interface AuthenticatedRequest extends Request {
  user: PayloadInterface;
}
