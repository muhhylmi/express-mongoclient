import BaseRoutes from "../../../router/BaseRouter";
import NoteHandler from "../handlers/UserHandler";
import validate from "../../../helper/validation/validate";
import { createUserSchema, updateUserSchema, loginSchema } from "../schemas/Request";
import { UcQueries } from "../use_case/Queries";
import { UcCommand } from "../use_case/Commands";

class UserRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post("", validate(createUserSchema), NoteHandler.create);
    this.router.patch(
      "/:id",
      validate(updateUserSchema),
      NoteHandler.update
    );
    this.router.post("/login", validate(loginSchema), NoteHandler.login)
    this.router.delete("/:id", NoteHandler.delete);
    this.router.get("", NoteHandler.findAll);
    this.router.get("/:id", NoteHandler.findById);
  }
}

export default new UserRoutes().router