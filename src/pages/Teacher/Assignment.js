import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Calendar, FileText, Target, Book, Users, GraduationCap } from 'lucide-react';
import axios from '../../utils/Account/axios';

const TARGET_CHOICES = [
  { value: 'CURRICULUM_SPECIFIC', label: 'Curriculum Specific' },
  { value: 'CLASSROOM_SPECIFIC', label: 'Classroom Specific' },
  { value: 'SUBJECT_SPECIFIC', label: 'Subject Specific' }
];

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    attachment: null,
    target: 'CURRICULUM_SPECIFIC',
    curriculum: '',
    classroom: '',
    subject: ''
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchAssignments();
    fetchDropdownData();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('api/classroom/assignments');
      setAssignments(response.data);
    } catch (err) {
      setError('Failed to fetch assignments');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      // These endpoints might need to be adjusted based on your actual API
      const [curriculumRes, classroomRes, subjectRes] = await Promise.all([
        axios.get('api/curriculums').catch(() => ({ data: [] })),
        axios.get('api/classrooms').catch(() => ({ data: [] })),
        axios.get('api/subjects').catch(() => ({ data: [] }))
      ]);
      
      setCurriculums(curriculumRes.data);
      setClassrooms(classroomRes.data);
      setSubjects(subjectRes.data);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleTargetChange = (e) => {
    const target = e.target.value;
    setFormData(prev => ({
      ...prev,
      target,
      curriculum: target !== 'CURRICULUM_SPECIFIC' ? '' : prev.curriculum,
      classroom: target !== 'CLASSROOM_SPECIFIC' ? '' : prev.classroom
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.deadline) return 'Deadline is required';
    if (!formData.subject) return 'Subject is required';
    
    if (formData.target === 'CURRICULUM_SPECIFIC' && !formData.curriculum) {
      return 'Curriculum must be selected for curriculum specific assignments';
    }
    if (formData.target === 'CLASSROOM_SPECIFIC' && !formData.classroom) {
      return 'Classroom must be selected for classroom specific assignments';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('deadline', formData.deadline);
      submitData.append('target', formData.target);
      submitData.append('subject', formData.subject);
      
      if (formData.curriculum) {
        submitData.append('curriculum', formData.curriculum);
      }
      if (formData.classroom) {
        submitData.append('classroom', formData.classroom);
      }
      if (formData.attachment) {
        submitData.append('attachment', formData.attachment);
      }

      if (editingId) {
        await axios.put(`api/classroom/assignments/${editingId}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setError('');
      } else {
        await axios.post('api/classroom/assignments', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setError('');
      }

      resetForm();
      fetchAssignments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save assignment');
      console.error('Error saving assignment:', err);
    }
  };

  const handleEdit = (assignment) => {
    setFormData({
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline ? assignment.deadline.slice(0, 16) : '',
      attachment: null,
      target: assignment.target,
      curriculum: assignment.curriculum || '',
      classroom: assignment.classroom || '',
      subject: assignment.subject || ''
    });
    setEditingId(assignment.id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      await axios.delete(`api/classroom/assignments/${id}`);
      fetchAssignments();
      setError('');
    } catch (err) {
      setError('Failed to delete assignment');
      console.error('Error deleting assignment:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      deadline: '',
      attachment: null,
      target: 'CURRICULUM_SPECIFIC',
      curriculum: '',
      classroom: '',
      subject: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getTargetLabel = (target) => {
    const choice = TARGET_CHOICES.find(c => c.value === target);
    return choice ? choice.label : target;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Book className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Assignment
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter assignment title"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="datetime-local"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter assignment description"
                  />
                </div>

                {/* Target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target *
                  </label>
                  <div className="relative">
                    <Target className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <select
                      name="target"
                      value={formData.target}
                      onChange={handleTargetChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {TARGET_CHOICES.map(choice => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name || subject.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Conditional Fields */}
                {formData.target === 'CURRICULUM_SPECIFIC' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Curriculum *
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <select
                        name="curriculum"
                        value={formData.curriculum}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Curriculum</option>
                        {curriculums.map(curriculum => (
                          <option key={curriculum.id} value={curriculum.id}>
                            {curriculum.name || curriculum.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {formData.target === 'CLASSROOM_SPECIFIC' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Classroom *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <select
                        name="classroom"
                        value={formData.classroom}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Classroom</option>
                        {classrooms.map(classroom => (
                          <option key={classroom.id} value={classroom.id}>
                            {classroom.name || classroom.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Attachment */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="file"
                      name="attachment"
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Create'} Assignment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Assignments List */}
        <div className="p-6">
          {assignments.length === 0 ? (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No assignments found</p>
              <p className="text-gray-400">Create your first assignment to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {assignments.map(assignment => (
                <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Assignment"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Assignment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {assignment.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Due: {formatDate(assignment.deadline)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <Target className="h-4 w-4 mr-2" />
                      <span>{getTargetLabel(assignment.target)}</span>
                    </div>

                    {assignment.subject_name && (
                      <div className="flex items-center text-gray-500">
                        <Book className="h-4 w-4 mr-2" />
                        <span>{assignment.subject_name}</span>
                      </div>
                    )}

                    {assignment.attachment && (
                      <div className="flex items-center text-blue-600">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Has Attachment</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignment;