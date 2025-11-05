<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserByRole;
use App\Models\MasUpt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserByRoleController extends Controller
{
    /**
     * Display user roles
     */
    public function index(Request $request)
    {
        $query = UserByRole::with('upt');

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('phone_number', 'like', "%{$search}%")
                  ->orWhere('bio', 'like', "%{$search}%")
                  ->orWhereHas('upt', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by UPT
        if ($request->has('upt_code')) {
            $query->where('upt_code', $request->upt_code);
        }

        $userRoles = $query->paginate(20);
        $upts = MasUpt::select('id', 'code', 'name')->orderBy('name')->get();

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'formatted_phone_number', 'label' => 'Phone Number'],
            ['key' => 'upt_name', 'label' => 'UPT'],
            ['key' => 'formatted_role', 'label' => 'Role'],
            ['key' => 'formatted_status', 'label' => 'Status'],
            ['key' => 'formatted_bio', 'label' => 'Bio'],
            ['key' => 'actions', 'label' => 'Actions', 'format' => 'actions']
        ];

        // Format rows data
        $userRoles->getCollection()->transform(function ($userRole) {
            // Format phone number dengan icon
            $userRole->formatted_phone_number = sprintf(
                '<div class="flex items-center">
                    <i class="fas fa-phone text-gray-400 mr-2"></i>
                    <span class="text-sm text-gray-900 dark:text-white">%s</span>
                </div>',
                e($userRole->phone_number ?: '-')
            );
            
            // Format UPT
            if ($userRole->upt) {
                $userRole->upt_name = sprintf(
                    '<div class="text-sm text-gray-900 dark:text-white">%s</div>
                    <div class="text-xs text-gray-500">%s</div>',
                    e($userRole->upt->name),
                    e($userRole->upt->code)
                );
            } else {
                $userRole->upt_name = '-';
            }
            
            // Format role untuk status badge
            $roleColors = [
                'admin' => 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
                'moderator' => 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                'user' => 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            ];
            $roleClass = $roleColors[$userRole->role] ?? 'bg-gray-100 text-gray-800';
            $userRole->formatted_role = sprintf(
                '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full %s">%s</span>',
                $roleClass,
                e(ucfirst($userRole->role))
            );
            
            // Format status untuk status badge
            $statusColors = [
                'active' => 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                'inactive' => 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
                'pending' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            ];
            $statusClass = $statusColors[$userRole->status] ?? 'bg-gray-100 text-gray-800';
            $userRole->formatted_status = sprintf(
                '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full %s">%s</span>',
                $statusClass,
                e(ucfirst($userRole->status))
            );
            
            // Format bio
            $userRole->formatted_bio = sprintf(
                '<div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">%s</div>',
                e($userRole->bio ?: '-')
            );
            
            // Prepare actions
            $userRole->actions = [
                [
                    'type' => 'button',
                    'label' => 'Edit',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => 'editUserRole(' . json_encode($userRole) . ')',
                    'title' => 'Edit'
                ],
                [
                    'type' => 'button',
                    'label' => 'Delete',
                    'icon' => 'trash',
                    'color' => 'red',
                    'onclick' => 'deleteUserRole(' . $userRole->id . ')',
                    'title' => 'Delete'
                ]
            ];
            
            return $userRole;
        });

        return view('admin.user_by_role.index', compact('userRoles', 'upts', 'tableHeaders'));
    }

    /**
     * Show create form
     */
    public function create()
    {
        $upts = MasUpt::select('id', 'code', 'name')->orderBy('name')->get();
        return view('admin.user_by_role.create', compact('upts'));
    }

    /**
     * Store new user role
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'nullable|string|max:30',
            'upt_code' => 'nullable|exists:mas_upts,code|unique:user_by_role,upt_code',
            'role' => 'required|in:admin,user,moderator',
            'status' => 'required|in:active,inactive,pending',
            'bio' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $userRole = UserByRole::create($validated);

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User role created successfully',
                    'data' => $userRole->load('upt')
                ]);
            }

            return redirect()->route('admin.user-by-role.index')
                ->with('success', 'User role created successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create user role: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to create user role: ' . $e->getMessage());
        }
    }

    /**
     * Show edit form
     */
    public function edit($id)
    {
        $userRole = UserByRole::with('upt')->findOrFail($id);
        $upts = MasUpt::select('id', 'code', 'name')->orderBy('name')->get();

        return view('admin.user_by_role.edit', compact('userRole', 'upts'));
    }

    /**
     * Update user role
     */
    public function update(Request $request, $id)
    {
        $userRole = UserByRole::findOrFail($id);

        $validated = $request->validate([
            'phone_number' => 'nullable|string|max:30',
            'upt_code' => 'nullable|exists:mas_upts,code|unique:user_by_role,upt_code,' . $id,
            'role' => 'required|in:admin,user,moderator',
            'status' => 'required|in:active,inactive,pending',
            'bio' => 'nullable|string'
        ]);

        try {
            $userRole->update($validated);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User role updated successfully',
                    'data' => $userRole->load('upt')
                ]);
            }

            return redirect()->route('admin.user-by-role.index')
                ->with('success', 'User role updated successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update user role: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to update user role: ' . $e->getMessage());
        }
    }

    /**
     * Delete user role
     */
    public function destroy(Request $request, $id)
    {
        try {
            $userRole = UserByRole::findOrFail($id);
            $userRole->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User role deleted successfully'
                ]);
            }

            return redirect()->route('admin.user-by-role.index')
                ->with('success', 'User role deleted successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete user role: ' . $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Failed to delete user role: ' . $e->getMessage());
        }
    }

    /**
     * Get user roles by UPT
     */
    public function getByUpt($uptCode)
    {
        $userRoles = UserByRole::with('upt')
            ->where('upt_code', $uptCode)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $userRoles
        ]);
    }

    /**
     * Get active user roles
     */
    public function getActive()
    {
        $userRoles = UserByRole::with('upt')
            ->where('status', 'active')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $userRoles
        ]);
    }
}

