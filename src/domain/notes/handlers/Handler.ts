import BaseRoutes from "../../../router/BaseRouter";
import NoteHandler from "../handlers/NoteHandler";
import validate from "../../../helper/validation/validate";
import { createNoteSchema, updateNoteSchema } from "../schemas/Request";
import { jwtAuth } from "../../../helper/middleware/jwtAuth";

class NoteRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post("", jwtAuth, validate(createNoteSchema), NoteHandler.create);
    this.router.patch(
      "/:id",
      validate(updateNoteSchema),
      NoteHandler.update
    );
    this.router.delete("/:id", NoteHandler.delete);
    this.router.get("", jwtAuth, NoteHandler.findAll);
    this.router.get("/:id", NoteHandler.findById);
  }
}

export default new NoteRoutes().router