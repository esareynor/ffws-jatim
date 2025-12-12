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

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'name', 'label' => 'Name'],
            ['key' => 'formatted_number', 'label' => 'Phone Number'],
            ['key' => 'formatted_status', 'label' => 'Status'],
            ['key' => 'created_at', 'label' => 'Added', 'format' => 'date'],
            ['key' => 'actions', 'label' => 'Actions', 'format' => 'actions']
        ];

        // Format rows data
        $numbers->getCollection()->transform(function ($number) {
            // Format name with icon
            $number->formatted_name = sprintf(
                '<div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <i class="fab fa-whatsapp text-green-600 dark:text-green-400"></i>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">%s</div>
                    </div>
                </div>',
                e($number->name)
            );
            
            // Format status dengan Alpine.js button
            $statusClass = $number->is_active 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            $number->formatted_status = sprintf(
                '<button @click="toggleStatus(%d, %s)" class="px-2 py-1 text-xs rounded-full %s">%s</button>',
                $number->id,
                $number->is_active ? 'true' : 'false',
                $statusClass,
                e($number->status_label)
            );
            
            // Prepare actions
            $number->actions = [
                [
                    'type' => 'button',
                    'label' => 'Test',
                    'icon' => 'paper-plane',
                    'color' => 'green',
                    'onclick' => 'testNumber(' . $number->id . ')',
                    'title' => 'Test'
                ],
                [
                    'type' => 'button',
                    'label' => 'Edit',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => 'editNumber(' . json_encode($number) . ')',
                    'title' => 'Edit'
                ],
                [
                    'type' => 'button',
                    'label' => 'Delete',
                    'icon' => 'trash',
                    'color' => 'red',
                    'onclick' => 'deleteNumber(' . $number->id . ')',
                    'title' => 'Delete'
                ]
            ];
            
            return $number;
        });

        return view('admin.whatsapp_numbers.index', compact('numbers', 'stats', 'tableHeaders'));
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


