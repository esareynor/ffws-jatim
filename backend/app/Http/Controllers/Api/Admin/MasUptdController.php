<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasUptd;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasUptdController extends Controller
{
    use ApiResponseTraits;

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');
            $uptCode = $request->input('upt_code');

            $query = MasUptd::with('upt');

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            }

            if ($uptCode) {
                $query->where('upt_code', $uptCode);
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $uptds = $query->paginate($perPage);

            return $this->paginatedResponse($uptds, 'UPTDs retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve UPTDs: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'upt_code' => 'required|string|max:100|exists:mas_upts,code',
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:mas_uptds,code',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $uptd = MasUptd::create($validator->validated());

            return $this->createdResponse($uptd->load('upt'), 'UPTD created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create UPTD: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $uptd = MasUptd::with('upt')->findOrFail($id);
            return $this->successResponse($uptd, 'UPTD retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('UPTD not found');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $uptd = MasUptd::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'upt_code' => 'sometimes|required|string|max:100|exists:mas_upts,code',
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:100|unique:mas_uptds,code,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $uptd->update($validator->validated());

            return $this->updatedResponse($uptd->load('upt'), 'UPTD updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update UPTD: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $uptd = MasUptd::findOrFail($id);
            $uptd->delete();

            return $this->deletedResponse('UPTD deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete UPTD: ' . $e->getMessage());
        }
    }
}

