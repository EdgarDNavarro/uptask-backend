import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        project.manager = req.user.id
        try {
            await project.save()
            res.send("Proyecto creado correctamente")
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error);
        }
        
    }

    static getAllprojects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error);
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const project = await Project.findById(id).populate('tasks')
            if(!project) {
                const error = new Error("Proyecto no encontrado")
                res.status(404).json({error: error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error("Proyecto no encontrado")
                res.status(404).json({error: error.message})
                return
            }

            res.json(project)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error);
        }
    }
    
    static updateProject = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const project = await Project.findById(id)
            if(!project) {
                const error = new Error("Proyecto no encontrado")
                res.status(404).json({error: error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error("Proyecto no encontrado")
                res.status(404).json({error: error.message})
                return
            }

            project.projectName = req.body.projectName
            project.clientName = req.body.clientName
            project.description = req.body.description
            await project.save()
            res.send("Proyecto actualizado")
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error);
        }
    }

    static deleteProyect = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const project = await Project.findById(id)
            if(!project) {
                const error = new Error("Proyecto no encontrado")
                res.status(404).json({error: error.message})
                return
            }
            if(project.manager.toString() !== req.user.id.toString()) {
                const error = new Error("Proyecto no encontrado")
                res.status(404).json({error: error.message})
                return
            }

            await project.deleteOne()
            res.send("Proyecto elimnado")
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error);
        }
    }
}