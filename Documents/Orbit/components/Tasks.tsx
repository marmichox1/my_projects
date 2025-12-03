
import React, { useState } from 'react';
import { Task, TeamMember } from '../types';
import { Search, Plus, Trash, X, Calendar, Flag, Clock, MoreHorizontal } from './Icons';
import Modal from './Modal';

interface TasksProps {
    tasks: Task[];
    team: TeamMember[];
    onAdd: (task: Omit<Task, 'id'>) => void;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, team, onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Task | null>(null);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        assignee: '',
        priority: 'Medium',
        status: 'Todo',
        tags: [],
        dueDate: new Date().toISOString().split('T')[0]
    });
    const [newTag, setNewTag] = useState('');

    const filteredTasks = tasks.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (item?: Task) => {
        if (item) {
            setEditingItem(item);
            setFormData({ ...item });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                description: '',
                assignee: team.length > 0 ? team[0].name : '',
                priority: 'Medium',
                status: 'Todo',
                tags: [],
                dueDate: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            onEdit({ ...formData, id: editingItem.id } as Task);
        } else {
            onAdd(formData as Omit<Task, 'id'>);
        }
        setIsModalOpen(false);
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            if (!formData.tags?.includes(newTag.trim())) {
                setFormData({ ...formData, tags: [...(formData.tags || []), newTag.trim()] });
            }
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tagToRemove) });
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'High': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: 'text-rose-500' };
            case 'Medium': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: 'text-amber-500' };
            case 'Low': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: 'text-blue-500' };
            default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', icon: 'text-slate-400' };
        }
    };

    const getTagColor = (index: number) => {
        const colors = [
            'bg-violet-50 text-violet-700',
            'bg-pink-50 text-pink-700',
            'bg-sky-50 text-sky-700',
            'bg-emerald-50 text-emerald-700',
            'bg-amber-50 text-amber-700'
        ];
        return colors[index % colors.length];
    };

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', taskId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, status: 'Todo' | 'In Progress' | 'Done') => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== status) {
            onEdit({ ...task, status });
        }
        setDraggedTaskId(null);
    };

    const columns: { id: 'Todo' | 'In Progress' | 'Done', title: string, accent: string }[] = [
        { id: 'Todo', title: 'To Do', accent: 'bg-slate-400' },
        { id: 'In Progress', title: 'In Progress', accent: 'bg-violet-500' },
        { id: 'Done', title: 'Completed', accent: 'bg-emerald-500' }
    ];

    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Task Board</h1>
                    <p className="text-slate-500 mt-1">Manage project tasks with Kanban view.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-slate-200"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Task</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex h-full gap-8 px-1 min-w-[1000px]">
                    {columns.map(col => {
                        const colTasks = filteredTasks.filter(t => t.status === col.id);

                        return (
                            <div
                                key={col.id}
                                className="flex-1 flex flex-col min-w-[320px] max-w-sm"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, col.id)}
                            >
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${col.accent}`}></div>
                                        <h3 className="font-bold text-slate-800 tracking-tight">{col.title}</h3>
                                        <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                            {colTasks.length}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleOpenModal()}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className={`flex-1 overflow-y-auto px-1 -mx-1 space-y-3 rounded-2xl ${draggedTaskId ? 'bg-slate-50/50 border-2 border-dashed border-slate-200/50' : ''}`}>
                                    {colTasks.map(task => {
                                        const priorityStyle = getPriorityStyle(task.priority);
                                        return (
                                            <div
                                                key={task.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onClick={() => handleOpenModal(task)}
                                                className={`group relative bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-violet-200 cursor-grab active:cursor-grabbing transition-all duration-200 ${draggedTaskId === task.id ? 'opacity-40 rotate-2' : ''}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-slate-800 text-sm leading-snug pr-6">{task.title}</h3>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                                                        className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {task.description && (
                                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
                                                )}

                                                {task.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                                        {task.tags.map((tag, idx) => (
                                                            <span key={idx} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${getTagColor(idx)}`}>
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 ring-2 ring-white" title={task.assignee}>
                                                            {task.assignee.charAt(0)}
                                                        </div>
                                                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                                                            <Flag className={`w-3 h-3 ${priorityStyle.icon}`} />
                                                            {task.priority}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {colTasks.length === 0 && (
                                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50/50">
                                            <div className="p-3 bg-white rounded-full shadow-sm">
                                                <Plus className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <span className="text-sm font-medium">No tasks yet</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${editingItem ? 'Edit' : 'Add'} Task`}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Add details about this task..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags?.map((tag, idx) => (
                                <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-medium">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-violet-900">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Type tag and press Enter..."
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
                            <select
                                value={formData.assignee}
                                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="">Unassigned</option>
                                {team.map(member => (
                                    <option key={member.id} value={member.name}>{member.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                required
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-slate-200"
                        >
                            {editingItem ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
