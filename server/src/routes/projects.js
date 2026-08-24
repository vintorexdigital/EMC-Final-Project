import { Router } from 'express';
import Project from '../models/Project.js';
import Comment from '../models/Comment.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const cleanTags = (tags = []) => [...new Set(tags.map(tag => String(tag).trim().toLowerCase()).filter(Boolean))].slice(0, 12);

router.get('/', async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim();
    const filter = search ? { $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }, { tags: { $regex: search, $options: 'i' } }] } : {};
    res.json(await Project.find(filter).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});

router.get('/:id/comments', async (req, res, next) => {
  try { res.json(await Comment.find({ projectId: req.params.id }).sort({ createdAt: -1 })); }
  catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json(project);
  } catch (error) { next(error); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, description, githubUrl, liveDemoUrl } = req.body;
    if (!title || !description || !githubUrl) return res.status(400).json({ message: 'Title, description, and GitHub link are required.' });
    const project = await Project.create({ title, description, githubUrl, liveDemoUrl, tags: cleanTags(req.body.tags), ownerId: req.user.uid, ownerName: req.user.name || req.user.email || 'Student' });
    res.status(201).json(project);
  } catch (error) { next(error); }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, ownerId: req.user.uid });
    if (!project) return res.status(404).json({ message: 'Project not found or you are not the owner.' });
    ['title', 'description', 'githubUrl', 'liveDemoUrl'].forEach(field => { if (req.body[field] !== undefined) project[field] = req.body[field]; });
    if (req.body.tags) project.tags = cleanTags(req.body.tags);
    await project.save(); res.json(project);
  } catch (error) { next(error); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, ownerId: req.user.uid });
    if (!project) return res.status(404).json({ message: 'Project not found or you are not the owner.' });
    await Comment.deleteMany({ projectId: req.params.id }); res.status(204).end();
  } catch (error) { next(error); }
});

router.post('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    if (!req.body.text?.trim()) return res.status(400).json({ message: 'Comment text is required.' });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.status(201).json(await Comment.create({ projectId: project._id, text: req.body.text, authorId: req.user.uid, authorName: req.user.name || req.user.email || 'Student' }));
  } catch (error) { next(error); }
});

export default router;
