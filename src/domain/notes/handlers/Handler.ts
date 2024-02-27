import BaseRoutes from "../../../helper/router/BaseRouter";
import validate from "../../../helper/validation/validate";
import { createNoteSchema, updateNoteSchema } from "../schemas/Request";
import { jwtAuth } from "../../../helper/middleware/jwtAuth";
import CommandHandler from "./CommandHandler";
import QueryHandler from "./QueryHandler";

class NoteRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post("", jwtAuth, validate(createNoteSchema), CommandHandler.create);
    this.router.patch(
      "/:id",
      validate(updateNoteSchema),
      CommandHandler.update
    );
    this.router.delete("/:id", CommandHandler.delete);
    this.router.get("", jwtAuth, QueryHandler.findAll);
    this.router.get("/:id", QueryHandler.findById);
  }
}

export default new NoteRoutes().router