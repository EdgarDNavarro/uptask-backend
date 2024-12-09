import type { Request, Response } from "express"
import Note, { INote } from "../models/Note"
import { Types } from "mongoose"

type NodeParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body
        const note = new Note()
        note.content = content
        note.createdBy = req.user.id
        note.task = req.task.id

        req.task.notes.push(note.id)

        try {
            await Promise.allSettled([note.save(), req.task.save()])
            res.send("Nota creada correctamente")
        } catch (error) {
            res.status(500).json({error: 'hubo un error'})
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const note = await Note.find({task: req.task.id})
            res.json(note)
        } catch (error) {
            res.status(500).json({error: 'hubo un error'})
        }
    }

    static deleteNote = async (req: Request<NodeParams>, res: Response) => {
        const { noteId } = req.params
        console.log(noteId);
        
        try {
            const note = await Note.findById(noteId)
            if(!note) {
                const error = new Error('Nota no encontrada')
                res.status(404).json({error: error.message})
                return
            }

            if(note.createdBy.toString() !== req.user.id.toString()) {
                const error = new Error('No autorizado')
                res.status(401).json({error: error.message})
                return
            }

            req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())

            await Promise.allSettled([note.deleteOne(), req.task.save()])
            res.send("Nota eliminada correctamente")
        } catch (error) {
            res.status(500).json({error: 'hubo un error'})
        }
    }
}