import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, BookOpen, GraduationCap } from 'lucide-react';
import axios from '../../utils/Account/axios';

const SubjectAndCir = () => {
  const [subjects, setSubjects] = useState([]);
  const [curriculums, setCurriculums] = useState([]);
  const [activeTab, setActiveTab] = useState('subjects');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Subject form state
  const [subjectForm, setSubjectForm] = useState({
    id: null,
    name: '',
    credits: '',
    isEditing: false,
    showForm: false
  });

  // Curriculum form state
  const [curriculumForm, setCurriculumForm] = useState({
    id: null,
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    subjects: [],
    isEditing: false,
    showForm: false
  });

  useEffect(() => {
    fetchSubjects();
    fetchCurriculums();
  }, []);

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };

  // Subject CRUD operations
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get('api/classroom/subjects/');
      setSubjects(response.data);
    } catch (err) {
      showMessage('Failed to fetch subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async () => {
    try {
      const response = await axios.post('api/classroom/subjects/', {
        name: subjectForm.name,
        credits: parseInt(subjectForm.credits)
      });
      setSubjects([...subjects, response.data]);
      resetSubjectForm();
      showMessage('Subject created successfully');
    } catch (err) {
      showMessage('Failed to create subject', 'error');
    }
  };

  const updateSubject = async () => {
    try {
      const response = await axios.put(`api/classroom/subjects/${subjectForm.id}/`, {
        name: subjectForm.name,
        credits: parseInt(subjectForm.credits)
      });
      setSubjects(subjects.map(s => s.id === subjectForm.id ? response.data : s));
      resetSubjectForm();
      showMessage('Subject updated successfully');
    } catch (err) {
      showMessage('Failed to update subject', 'error');
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    
    try {
      await axios.delete(`api/classroom/subjects/${id}/`);
      setSubjects(subjects.filter(s => s.id !== id));
      showMessage('Subject deleted successfully');
    } catch (err) {
      showMessage('Failed to delete subject', 'error');
    }
  };

  const resetSubjectForm = () => {
    setSubjectForm({
      id: null,
      name: '',
      credits: '',
      isEditing: false,
      showForm: false
    });
  };

  const editSubject = (subject) => {
    setSubjectForm({
      id: subject.id,
      name: subject.name,
      credits: subject.credits.toString(),
      isEditing: true,
      showForm: true
    });
  };

  // Curriculum CRUD operations
  const fetchCurriculums = async () => {
    setLoading(true);
    try {
      const response = await axios.get('api/classroom/curriculums/');
      setCurriculums(response.data);
    } catch (err) {
      showMessage('Failed to fetch curriculums', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createCurriculum = async () => {
    try {
      const payload = {
        name: curriculumForm.name,
        description: curriculumForm.description,
        start_date: curriculumForm.start_date,
        end_date: curriculumForm.end_date || null,
        subjects: curriculumForm.subjects
      };
      const response = await axios.post('api/classroom/curriculums/', payload);
      setCurriculums([...curriculums, response.data]);
      resetCurriculumForm();
      showMessage('Curriculum created successfully');
    } catch (err) {
      showMessage('Failed to create curriculum', 'error');
    }
  };

  const updateCurriculum = async () => {
    try {
      const payload = {
        name: curriculumForm.name,
        description: curriculumForm.description,
        start_date: curriculumForm.start_date,
        end_date: curriculumForm.end_date || null,
        subjects: curriculumForm.subjects
      };
      const response = await axios.put(`api/classroom/curriculums/${curriculumForm.id}/`, payload);
      setCurriculums(curriculums.map(c => c.id === curriculumForm.id ? response.data : c));
      resetCurriculumForm();
      showMessage('Curriculum updated successfully');
    } catch (err) {
      showMessage('Failed to update curriculum', 'error');
    }
  };

  const deleteCurriculum = async (id) => {
    if (!window.confirm('Are you sure you want to delete this curriculum?')) return;
    
    try {
      await axios.delete(`api/classroom/curriculums/${id}/`);
      setCurriculums(curriculums.filter(c => c.id !== id));
      showMessage('Curriculum deleted successfully');
    } catch (err) {
      showMessage('Failed to delete curriculum', 'error');
    }
  };

  const resetCurriculumForm = () => {
    setCurriculumForm({
      id: null,
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      subjects: [],
      isEditing: false,
      showForm: false
    });
  };

  const editCurriculum = (curriculum) => {
    setCurriculumForm({
      id: curriculum.id,
      name: curriculum.name,
      description: curriculum.description,
      start_date: curriculum.start_date,
      end_date: curriculum.end_date || '',
      subjects: curriculum.subjects?.map(s => s.id) || [],
      isEditing: true,
      showForm: true
    });
  };

  const handleSubjectSubmit = (e) => {
    e && e.preventDefault();
    if (subjectForm.isEditing) {
      updateSubject();
    } else {
      createSubject();
    }
  };

  const handleCurriculumSubmit = (e) => {
    e && e.preventDefault();
    if (curriculumForm.isEditing) {
      updateCurriculum();
    } else {
      createCurriculum();
    }
  };

  const toggleSubjectSelection = (subjectId) => {
    const newSubjects = curriculumForm.subjects.includes(subjectId)
      ? curriculumForm.subjects.filter(id => id !== subjectId)
      : [...curriculumForm.subjects, subjectId];
    
    setCurriculumForm({...curriculumForm, subjects: newSubjects});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Academic Management</h1>
          <p className="text-gray-600">Manage subjects and curriculums</p>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'subjects'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Subjects
            </button>
            <button
              onClick={() => setActiveTab('curriculums')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'curriculums'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Curriculums
            </button>
          </div>
        </div>

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            {/* Add Subject Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setSubjectForm({...subjectForm, showForm: true})}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Subject
              </button>
            </div>

            {/* Subject Form */}
            {subjectForm.showForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4">
                  {subjectForm.isEditing ? 'Edit Subject' : 'Add New Subject'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credits
                    </label>
                    <input
                      type="number"
                      value={subjectForm.credits}
                      onChange={(e) => setSubjectForm({...subjectForm, credits: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleSubjectSubmit}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {subjectForm.isEditing ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={resetSubjectForm}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Subjects List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editSubject(subject)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium">Credits:</span> {subject.credits}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curriculums Tab */}
        {activeTab === 'curriculums' && (
          <div className="space-y-6">
            {/* Add Curriculum Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setCurriculumForm({...curriculumForm, showForm: true})}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Curriculum
              </button>
            </div>

            {/* Curriculum Form */}
            {curriculumForm.showForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">
                  {curriculumForm.isEditing ? 'Edit Curriculum' : 'Add New Curriculum'}
                </h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Curriculum Name
                      </label>
                      <input
                        type="text"
                        value={curriculumForm.name}
                        onChange={(e) => setCurriculumForm({...curriculumForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={curriculumForm.start_date}
                        onChange={(e) => setCurriculumForm({...curriculumForm, start_date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={curriculumForm.end_date}
                      onChange={(e) => setCurriculumForm({...curriculumForm, end_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={curriculumForm.description}
                      onChange={(e) => setCurriculumForm({...curriculumForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Subjects
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                      {subjects.map((subject) => (
                        <label key={subject.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={curriculumForm.subjects.includes(subject.id)}
                            onChange={() => toggleSubjectSelection(subject.id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{subject.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCurriculumSubmit}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {curriculumForm.isEditing ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={resetCurriculumForm}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculums List */}
            <div className="grid gap-6 lg:grid-cols-2">
              {curriculums.map((curriculum) => (
                <div key={curriculum.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{curriculum.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editCurriculum(curriculum)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCurriculum(curriculum.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{curriculum.description}</p>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Start Date:</span> {curriculum.start_date}</p>
                    {curriculum.end_date && (
                      <p><span className="font-medium">End Date:</span> {curriculum.end_date}</p>
                    )}
                    <div>
                      <span className="font-medium">Subjects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {curriculum.subjects?.map((subject) => (
                          <span
                            key={subject.id}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                          >
                            {subject.name}
                          </span>
                        )) || <span className="text-gray-500">No subjects assigned</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectAndCir;