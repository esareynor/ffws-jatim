<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasWhatsappNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class MasWhatsappNumberController extends Controller
{
    use ApiResponseTraits;

    /**
     * Display a listing of whatsapp numbers.
     */
    public function index(Request $request)
    {
        try {
            $query = MasWhatsappNumber::query();

            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->is_active === 'true' ? 1 : 0);
            }

            // Search by name or number
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('number', 'like', "%{$search}%");
                });
            }

            // Sort
            $sortBy = $request->get('sort_by', 'name');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $numbers = $query->paginate($perPage);

            // Add formatted numbers
            $numbers->getCollection()->transform(function ($number) {
                $number->formatted_number = $number->formatted_number;
                $number->display_name = $number->display_name;
                return $number;
            });

            return $this->successResponse($numbers, 'WhatsApp numbers berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created whatsapp number.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'number' => [
                'required',
                'string',
                'max:20',
                'unique:mas_whatsapp_numbers,number',
                'regex:/^(\+62|62|0)[0-9]{9,12}$/' // Indonesian phone number format
            ],
            'is_active' => 'boolean'
        ], [
            'number.regex' => 'Format nomor WhatsApp tidak valid. Gunakan format: 08xxxxxxxxxx atau +628xxxxxxxxxx'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            $whatsappNumber = MasWhatsappNumber::create([
                'name' => $request->name,
                'number' => $request->number,
                'is_active' => $request->get('is_active', true)
            ]);

            DB::commit();

            return $this->successResponse(
                $whatsappNumber,
                'WhatsApp number berhasil ditambahkan',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menambahkan number: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified whatsapp number.
     */
    public function show($id)
    {
        try {
            $whatsappNumber = MasWhatsappNumber::findOrFail($id);
            $whatsappNumber->formatted_number = $whatsappNumber->formatted_number;
            $whatsappNumber->display_name = $whatsappNumber->display_name;

            return $this->successResponse($whatsappNumber, 'WhatsApp number berhasil diambil');
        } catch (\Exception $e) {
            return $this->notFoundResponse('WhatsApp number tidak ditemukan');
        }
    }

    /**
     * Update the specified whatsapp number.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'number' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                'unique:mas_whatsapp_numbers,number,' . $id,
                'regex:/^(\+62|62|0)[0-9]{9,12}$/'
            ],
            'is_active' => 'boolean'
        ], [
            'number.regex' => 'Format nomor WhatsApp tidak valid. Gunakan format: 08xxxxxxxxxx atau +628xxxxxxxxxx'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $whatsappNumber = MasWhatsappNumber::findOrFail($id);

            DB::beginTransaction();

            $whatsappNumber->update($request->all());

            DB::commit();

            return $this->successResponse(
                $whatsappNumber,
                'WhatsApp number berhasil diupdate'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal mengupdate number: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified whatsapp number.
     */
    public function destroy($id)
    {
        try {
            $whatsappNumber = MasWhatsappNumber::findOrFail($id);

            DB::beginTransaction();

            $whatsappNumber->delete();

            DB::commit();

            return $this->successResponse(null, 'WhatsApp number berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghapus number: ' . $e->getMessage());
        }
    }

    /**
     * Toggle active status.
     */
    public function toggleActive($id)
    {
        try {
            $whatsappNumber = MasWhatsappNumber::findOrFail($id);

            DB::beginTransaction();

            $whatsappNumber->is_active = !$whatsappNumber->is_active;
            $whatsappNumber->save();

            DB::commit();

            return $this->successResponse(
                $whatsappNumber,
                'Status berhasil diubah menjadi ' . ($whatsappNumber->is_active ? 'active' : 'inactive')
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal mengubah status: ' . $e->getMessage());
        }
    }

    /**
     * Get all active numbers.
     */
    public function getActive()
    {
        try {
            $numbers = MasWhatsappNumber::active()->get();

            $numbers->transform(function ($number) {
                $number->formatted_number = $number->formatted_number;
                return $number;
            });

            return $this->successResponse($numbers, 'Active WhatsApp numbers berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Send test message (placeholder for WhatsApp integration).
     */
    public function sendTestMessage(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $whatsappNumber = MasWhatsappNumber::findOrFail($id);

            if (!$whatsappNumber->is_active) {
                return $this->validationErrorResponse([
                    'number' => ['Nomor WhatsApp tidak aktif']
                ]);
            }

            // TODO: Integrate with actual WhatsApp API (e.g., Twilio, WhatsApp Business API)
            // For now, just return success response
            
            return $this->successResponse([
                'number' => $whatsappNumber->formatted_number,
                'message' => $request->message,
                'status' => 'Test message would be sent (WhatsApp API integration pending)'
            ], 'Test message prepared');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengirim test message: ' . $e->getMessage());
        }
    }

    /**
     * Bulk send message to all active numbers (placeholder).
     */
    public function bulkSend(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
            'number_ids' => 'nullable|array',
            'number_ids.*' => 'exists:mas_whatsapp_numbers,id'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $query = MasWhatsappNumber::active();

            if ($request->has('number_ids')) {
                $query->whereIn('id', $request->number_ids);
            }

            $numbers = $query->get();

            if ($numbers->isEmpty()) {
                return $this->validationErrorResponse([
                    'numbers' => ['Tidak ada nomor aktif yang dipilih']
                ]);
            }

            // TODO: Integrate with actual WhatsApp API for bulk sending
            
            return $this->successResponse([
                'total_recipients' => $numbers->count(),
                'message' => $request->message,
                'recipients' => $numbers->pluck('formatted_number'),
                'status' => 'Bulk message would be sent (WhatsApp API integration pending)'
            ], 'Bulk message prepared');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengirim bulk message: ' . $e->getMessage());
        }
    }
}

