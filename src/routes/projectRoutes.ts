import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router()
router.use(authenticate)
router.param('projectId', projectExists)
router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.post('/', 
    body("projectName").notEmpty().withMessage("El nombre de proyecto es obligatorio"),
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description").notEmpty().withMessage("La descripcion es obligatoria"),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllprojects)

router.get('/:id', 
    param("id").isMongoId().withMessage("Ese id no es valido"),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id', 
    param("id").isMongoId().withMessage("Ese id no es valido"),
    body("projectName").notEmpty().withMessage("El nombre de proyecto es obligatorio"),
    body("clientName").notEmpty().withMessage("El nombre del cliente es obligatorio"),
    body("description").notEmpty().withMessage("La descripcion es obligatoria"),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:id', 
    param("id").isMongoId().withMessage("Ese id no es valido"),
    handleInputErrors,
    ProjectController.deleteProyect
)

// Routes for task
router.post('/:projectId/tasks',
    hasAuthorization,
    param("projectId").isMongoId().withMessage("Ese projectId no es valido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description").notEmpty().withMessage("La descripcion es obligatoria"),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    param("projectId").isMongoId().withMessage("Ese projectId no es valido"),
    handleInputErrors,
    TaskController.getProjectTask
)

router.get('/:projectId/tasks/:taskId',
    param("projectId").isMongoId().withMessage("Ese projectId no es valido"),
    param("taskId").isMongoId().withMessage("Ese projectId no es valido"),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param("projectId").isMongoId().withMessage("Ese projectId no es valido"),
    param("taskId").isMongoId().withMessage("Ese projectId no es valido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description").notEmpty().withMessage("La descripcion es obligatoria"),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param("projectId").isMongoId().withMessage("Ese projectId no es valido"),
    param("taskId").isMongoId().withMessage("Ese projectId no es valido"),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param("projectId").isMongoId().withMessage("Ese projectId no es valido"),
    param("taskId").isMongoId().withMessage("Ese projectId no es valido"),
    body('status').notEmpty().withMessage("El estado es obligatorio"),
    handleInputErrors,
    TaskController.updateStatus
)

/**For Team */

router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage("Email no valido"),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.post('/:projectId/team',
    body('id').isMongoId().withMessage("id no valido"),
    handleInputErrors,
    TeamMemberController.addMemeberById
)

router.get('/:projectId/team', TeamMemberController.getProjectTeam)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage("userId no valido"),
    handleInputErrors,
    TeamMemberController.removeMemeberById
)

/** Notes */

router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage("El contenido de las notas es obligatorio"),
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage("ID no valido"),
    NoteController.deleteNote
)

export default router