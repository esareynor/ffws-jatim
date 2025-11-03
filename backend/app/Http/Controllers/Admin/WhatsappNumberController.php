<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasWhatsappNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WhatsappNumberController extends Controller
{
    /**
     * Display a listing of WhatsApp numbers
     */
    public function index(Request $request)
    {
        $query = MasWhatsappNumber::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('number', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $numbers = $query->latest()->paginate($request->get('per_page', 15));

        // Stats
        $stats = [
            'total' => MasWhatsappNumber::count(),
            'active' => MasWhatsappNumber::where('is_active', true)->count(),
            'inactive' => MasWhatsappNumber::where('is_active', false)->count(),
        ];

        return view('admin.whatsapp_numbers.index', compact('numbers', 'stats'));
    }

    /**
     * Store a newly created WhatsApp number
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
                function ($attribute, $value, $fail) {
                    if (!MasWhatsappNumber::validateIndonesianNumber($value)) {
                        $fail('The ' . $attribute . ' must be a valid Indonesian phone number.');
                    }
                },
            ],
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Normalize the phone number
        $normalizedNumber = MasWhatsappNumber::normalizeNumber($request->number);

        MasWhatsappNumber::create([
            'name' => $request->name,
            'number' => $normalizedNumber,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('admin.whatsapp-numbers.index')
            ->with('success', 'WhatsApp number added successfully');
    }

    /**
     * Update the specified WhatsApp number
     */
    public function update(Request $request, $id)
    {
        $number = MasWhatsappNumber::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'number' => [
                'required',
                'string',
                'max:20',
                'unique:mas_whatsapp_numbers,number,' . $id,
                function ($attribute, $value, $fail) {
                    if (!MasWhatsappNumber::validateIndonesianNumber($value)) {
                        $fail('The ' . $attribute . ' must be a valid Indonesian phone number.');
                    }
                },
            ],
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Normalize the phone number
        $normalizedNumber = MasWhatsappNumber::normalizeNumber($request->number);

        $number->update([
            'name' => $request->name,
            'number' => $normalizedNumber,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('admin.whatsapp-numbers.index')
            ->with('success', 'WhatsApp number updated successfully');
    }

    /**
     * Remove the specified WhatsApp number
     */
    public function destroy($id)
    {
        $number = MasWhatsappNumber::findOrFail($id);
        $number->delete();

        return redirect()->route('admin.whatsapp-numbers.index')
            ->with('success', 'WhatsApp number deleted successfully');
    }

    /**
     * Toggle number active status
     */
    public function toggleActive($id)
    {
        $number = MasWhatsappNumber::findOrFail($id);
        $number->is_active = !$number->is_active;
        $number->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'is_active' => $number->is_active
        ]);
    }

    /**
     * Test WhatsApp connection (placeholder for future implementation)
     */
    public function testConnection($id)
    {
        $number = MasWhatsappNumber::findOrFail($id);

        // TODO: Implement actual WhatsApp API connection test
        // For now, just return success

        return response()->json([
            'success' => true,
            'message' => 'Test message would be sent to ' . $number->formatted_number,
            'number' => $number->formatted_number
        ]);
    }

    /**
     * Get active numbers for API
     */
    public function getActive()
    {
        $numbers = MasWhatsappNumber::active()->get();

        return response()->json([
            'success' => true,
            'data' => $numbers
        ]);
    }
}

