import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";

const router = Router()
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
    param("projectId").isMongoId().withMessage("Ese projectId no es valido"),
    param("taskId").isMongoId().withMessage("Ese projectId no es valido"),
    body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
    body("description").notEmpty().withMessage("La descripcion es obligatoria"),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
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

export default router