@extends('layouts.admin')

@section('title', 'Threshold Management')

@section('content')
<div class="container-fluid px-4 py-6" x-data="thresholdManager()">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Threshold Management</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage dynamic threshold templates, levels, and sensor assignments</p>
        </div>
        <button @click="openTemplateModal()" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i>
            New Template
        </button>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="-mb-px flex space-x-8">
                <button @click="activeTab = 'templates'" 
                    :class="activeTab === 'templates' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                    class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-layer-group mr-2"></i>
                    Templates
                </button>
                <button @click="activeTab = 'assignments'" 
                    :class="activeTab === 'assignments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                    class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                    <i class="fas fa-link mr-2"></i>
                    Sensor Assignments
                </button>
            </nav>
        </div>
    </div>

    <!-- Templates Tab -->
    <div x-show="activeTab === 'templates'" x-cloak>
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <template x-for="template in templates" :key="template.id">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <!-- Template Header -->
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white" x-text="template.name"></h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1" x-text="template.code"></p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span :class="template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" 
                                class="px-2 py-1 text-xs font-medium rounded-full">
                                <span x-text="template.is_active ? 'Active' : 'Inactive'"></span>
                            </span>
                            <div class="relative" x-data="{ open: false }">
                                <button @click="open = !open" class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <div x-show="open" @click.away="open = false" 
                                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                                    <button @click="editTemplate(template); open = false" 
                                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <i class="fas fa-edit mr-2"></i> Edit
                                    </button>
                                    <button @click="manageLevels(template); open = false" 
                                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <i class="fas fa-layer-group mr-2"></i> Manage Levels
                                    </button>
                                    <button @click="deleteTemplate(template.id); open = false" 
                                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900">
                                        <i class="fas fa-trash mr-2"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Template Info -->
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center text-sm">
                            <span class="text-gray-500 dark:text-gray-400 w-24">Type:</span>
                            <span class="text-gray-900 dark:text-white capitalize" x-text="template.parameter_type.replace('_', ' ')"></span>
                        </div>
                        <div class="flex items-center text-sm">
                            <span class="text-gray-500 dark:text-gray-400 w-24">Unit:</span>
                            <span class="text-gray-900 dark:text-white" x-text="template.unit || '-'"></span>
                        </div>
                        <div class="flex items-center text-sm">
                            <span class="text-gray-500 dark:text-gray-400 w-24">Levels:</span>
                            <span class="text-gray-900 dark:text-white" x-text="template.levels?.length || 0"></span>
                        </div>
                    </div>

                    <!-- Levels Preview -->
                    <div class="space-y-2">
                        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Threshold Levels:</div>
                        <template x-if="template.levels && template.levels.length > 0">
                            <div class="space-y-1">
                                <template x-for="level in template.levels.slice(0, 3)" :key="level.id">
                                    <div class="flex items-center justify-between text-xs p-2 rounded" 
                                        :style="'background-color: ' + level.color_hex + '20'">
                                        <span class="font-medium" x-text="level.level_name"></span>
                                        <span class="text-gray-600 dark:text-gray-400">
                                            <span x-text="level.min_value || '-'"></span> - 
                                            <span x-text="level.max_value || '-'"></span>
                                        </span>
                                    </div>
                                </template>
                                <template x-if="template.levels.length > 3">
                                    <div class="text-xs text-gray-500 text-center py-1">
                                        +<span x-text="template.levels.length - 3"></span> more levels
                                    </div>
                                </template>
                            </div>
                        </template>
                        <template x-if="!template.levels || template.levels.length === 0">
                            <div class="text-xs text-gray-400 text-center py-2">No levels defined</div>
                        </template>
                    </div>
                </div>
            </template>
        </div>

        <!-- Empty State -->
        <div x-show="templates.length === 0" class="text-center py-12">
            <i class="fas fa-layer-group text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Templates Yet</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">Create your first threshold template to get started</p>
            <button @click="openTemplateModal()" class="btn btn-primary">
                <i class="fas fa-plus mr-2"></i>
                Create Template
            </button>
        </div>
    </div>

    <!-- Assignments Tab -->
    <div x-show="activeTab === 'assignments'" x-cloak>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <!-- Toolbar -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div class="flex items-center space-x-4">
                    <input type="text" x-model="assignmentSearch" placeholder="Search sensor..."
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <button @click="openAssignmentModal()" class="btn btn-primary">
                    <i class="fas fa-plus mr-2"></i>
                    Assign Template
                </button>
            </div>

            <!-- Assignments Table -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Sensor
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Template
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Effective Period
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <template x-for="assignment in filteredAssignments" :key="assignment.id">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white" x-text="assignment.sensor?.code"></div>
                                    <div class="text-xs text-gray-500" x-text="assignment.sensor?.parameter"></div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900 dark:text-white" x-text="assignment.template?.name"></div>
                                    <div class="text-xs text-gray-500" x-text="assignment.template?.levels?.length + ' levels'"></div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <div x-text="formatDate(assignment.effective_from)"></div>
                                    <div x-text="assignment.effective_to ? 'to ' + formatDate(assignment.effective_to) : 'Ongoing'"></div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="assignment.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" 
                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        <span x-text="assignment.is_active ? 'Active' : 'Inactive'"></span>
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button @click="editAssignment(assignment)" class="text-blue-600 hover:text-blue-900 mr-3">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button @click="deleteAssignment(assignment.id)" class="text-red-600 hover:text-red-900">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div x-show="assignments.length === 0" class="text-center py-12">
                <i class="fas fa-link text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Assignments Yet</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-4">Assign threshold templates to sensors</p>
                <button @click="openAssignmentModal()" class="btn btn-primary">
                    <i class="fas fa-plus mr-2"></i>
                    Create Assignment
                </button>
            </div>
        </div>
    </div>

    <!-- Template Modal -->
    <div x-show="showTemplateModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showTemplateModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <span x-text="editingTemplate ? 'Edit Template' : 'New Template'"></span>
                </h3>
                
                <form @submit.prevent="saveTemplate">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Name *</label>
                            <input type="text" x-model="templateForm.name" required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parameter Type *</label>
                            <select x-model="templateForm.parameter_type" required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="water_level">Water Level</option>
                                <option value="rainfall">Rainfall</option>
                                <option value="discharge">Discharge</option>
                                <option value="temperature">Temperature</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                            <input type="text" x-model="templateForm.unit" placeholder="e.g., cm, mm, m³/s"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea x-model="templateForm.description" rows="3"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>

                        <div class="flex items-center">
                            <input type="checkbox" x-model="templateForm.is_active" id="template_active"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="template_active" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Active
                            </label>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showTemplateModal = false" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <span x-text="editingTemplate ? 'Update' : 'Create'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Levels Modal -->
    <div x-show="showLevelsModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showLevelsModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        Manage Levels: <span x-text="currentTemplate?.name"></span>
                    </h3>
                    <button @click="addLevel()" class="btn btn-sm btn-primary">
                        <i class="fas fa-plus mr-2"></i> Add Level
                    </button>
                </div>

                <!-- Levels List -->
                <div class="space-y-3 mb-4 max-h-96 overflow-y-auto">
                    <template x-for="(level, index) in currentLevels" :key="level.id || index">
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Level Name *</label>
                                    <input type="text" x-model="level.level_name" required
                                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Order *</label>
                                    <input type="number" x-model="level.level_order" required min="1"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Min Value</label>
                                    <input type="number" step="0.01" x-model="level.min_value"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Max Value</label>
                                    <input type="number" step="0.01" x-model="level.max_value"
                                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg">
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Severity *</label>
                                    <select x-model="level.severity" required
                                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg">
                                        <option value="normal">Normal</option>
                                        <option value="watch">Watch</option>
                                        <option value="warning">Warning</option>
                                        <option value="danger">Danger</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Color Hex</label>
                                    <input type="color" x-model="level.color_hex"
                                        class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg">
                                </div>
                            </div>
                            <div class="mt-3 flex justify-end">
                                <button @click="removeLevel(index)" class="text-red-600 hover:text-red-800 text-sm">
                                    <i class="fas fa-trash mr-1"></i> Remove
                                </button>
                            </div>
                        </div>
                    </template>
                </div>

                <div class="flex justify-end space-x-3">
                    <button type="button" @click="showLevelsModal = false" class="btn btn-secondary">
                        Cancel
                    </button>
                    <button @click="saveLevels()" class="btn btn-primary">
                        Save Levels
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Assignment Modal -->
    <div x-show="showAssignmentModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showAssignmentModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <span x-text="editingAssignment ? 'Edit Assignment' : 'Assign Template'"></span>
                </h3>
                
                <form @submit.prevent="saveAssignment">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sensor *</label>
                            <select x-model="assignmentForm.mas_sensor_code" required :disabled="editingAssignment"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Sensor</option>
                                <template x-for="sensor in sensors" :key="sensor.code">
                                    <option :value="sensor.code" x-text="sensor.code + ' (' + sensor.parameter + ')'"></option>
                                </template>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template *</label>
                            <select x-model="assignmentForm.threshold_template_code" required :disabled="editingAssignment"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select Template</option>
                                <template x-for="template in templates" :key="template.code">
                                    <option :value="template.code" x-text="template.name"></option>
                                </template>
                            </select>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Effective From *</label>
                                <input type="date" x-model="assignmentForm.effective_from" required
                                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Effective To</label>
                                <input type="date" x-model="assignmentForm.effective_to"
                                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                            <textarea x-model="assignmentForm.notes" rows="3"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>

                        <div class="flex items-center" x-show="editingAssignment">
                            <input type="checkbox" x-model="assignmentForm.is_active" id="assignment_active"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="assignment_active" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Active
                            </label>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showAssignmentModal = false" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <span x-text="editingAssignment ? 'Update' : 'Assign'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function thresholdManager() {
    return {
        activeTab: 'templates',
        templates: @json($templates),
        sensors: @json($sensors),
        assignments: [],
        assignmentSearch: '',
        
        showTemplateModal: false,
        showLevelsModal: false,
        showAssignmentModal: false,
        
        editingTemplate: null,
        currentTemplate: null,
        currentLevels: [],
        editingAssignment: null,
        
        templateForm: {
            name: '',
            description: '',
            parameter_type: 'water_level',
            unit: '',
            is_active: true
        },
        
        assignmentForm: {
            mas_sensor_code: '',
            threshold_template_code: '',
            effective_from: '',
            effective_to: '',
            notes: '',
            is_active: true
        },
        
        init() {
            this.loadAssignments();
        },
        
        get filteredAssignments() {
            if (!this.assignmentSearch) return this.assignments;
            return this.assignments.filter(a => 
                a.sensor?.code.toLowerCase().includes(this.assignmentSearch.toLowerCase())
            );
        },
        
        async loadAssignments() {
            try {
                const response = await fetch('/api/sensor-thresholds/assignments');
                const data = await response.json();
                if (data.success) {
                    this.assignments = data.data;
                }
            } catch (error) {
                console.error('Error loading assignments:', error);
            }
        },
        
        openTemplateModal() {
            this.editingTemplate = null;
            this.templateForm = {
                name: '',
                description: '',
                parameter_type: 'water_level',
                unit: '',
                is_active: true
            };
            this.showTemplateModal = true;
        },
        
        editTemplate(template) {
            this.editingTemplate = template;
            this.templateForm = { ...template };
            this.showTemplateModal = true;
        },
        
        async saveTemplate() {
            try {
                const url = this.editingTemplate 
                    ? `/admin/thresholds/templates/${this.editingTemplate.id}`
                    : '/admin/thresholds/templates';
                    
                const method = this.editingTemplate ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify(this.templateForm)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    Swal.fire('Success', data.message, 'success');
                    this.showTemplateModal = false;
                    location.reload();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to save template', 'error');
            }
        },
        
        async deleteTemplate(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will delete the template and all its levels",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/admin/thresholds/templates/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        Swal.fire('Deleted!', data.message, 'success');
                        location.reload();
                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete template', 'error');
                }
            }
        },
        
        manageLevels(template) {
            this.currentTemplate = template;
            this.currentLevels = [...(template.levels || [])];
            this.showLevelsModal = true;
        },
        
        addLevel() {
            this.currentLevels.push({
                level_name: '',
                level_order: this.currentLevels.length + 1,
                min_value: null,
                max_value: null,
                color_hex: '#3B82F6',
                severity: 'normal',
                alert_enabled: false
            });
        },
        
        removeLevel(index) {
            this.currentLevels.splice(index, 1);
        },
        
        async saveLevels() {
            try {
                // Delete existing levels
                for (const level of this.currentTemplate.levels || []) {
                    if (!this.currentLevels.find(l => l.id === level.id)) {
                        await fetch(`/admin/thresholds/templates/${this.currentTemplate.id}/levels/${level.id}`, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                            }
                        });
                    }
                }
                
                // Save or update levels
                for (const level of this.currentLevels) {
                    const url = level.id 
                        ? `/admin/thresholds/templates/${this.currentTemplate.id}/levels/${level.id}`
                        : `/admin/thresholds/templates/${this.currentTemplate.id}/levels`;
                    const method = level.id ? 'PUT' : 'POST';
                    
                    await fetch(url, {
                        method: method,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        },
                        body: JSON.stringify(level)
                    });
                }
                
                Swal.fire('Success', 'Levels saved successfully', 'success');
                this.showLevelsModal = false;
                location.reload();
            } catch (error) {
                Swal.fire('Error', 'Failed to save levels', 'error');
            }
        },
        
        openAssignmentModal() {
            this.editingAssignment = null;
            this.assignmentForm = {
                mas_sensor_code: '',
                threshold_template_code: '',
                effective_from: new Date().toISOString().split('T')[0],
                effective_to: '',
                notes: '',
                is_active: true
            };
            this.showAssignmentModal = true;
        },
        
        editAssignment(assignment) {
            this.editingAssignment = assignment;
            this.assignmentForm = {
                mas_sensor_code: assignment.mas_sensor_code,
                threshold_template_code: assignment.threshold_template_code,
                effective_from: assignment.effective_from,
                effective_to: assignment.effective_to || '',
                notes: assignment.notes || '',
                is_active: assignment.is_active
            };
            this.showAssignmentModal = true;
        },
        
        async saveAssignment() {
            try {
                const url = this.editingAssignment 
                    ? `/admin/thresholds/assignments/${this.editingAssignment.id}`
                    : '/admin/thresholds/assignments';
                const method = this.editingAssignment ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify(this.assignmentForm)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    Swal.fire('Success', data.message, 'success');
                    this.showAssignmentModal = false;
                    this.loadAssignments();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to save assignment', 'error');
            }
        },
        
        async deleteAssignment(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will remove the threshold assignment",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/admin/thresholds/assignments/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        Swal.fire('Deleted!', data.message, 'success');
                        this.loadAssignments();
                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete assignment', 'error');
                }
            }
        },
        
        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }
    }
}
</script>
@endsection
