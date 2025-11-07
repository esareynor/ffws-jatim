<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RatingCurveController extends Controller
{
    private $apiBaseUrl;

    public function __construct()
    {
        $this->apiBaseUrl = config('app.url') . '/api/rating-curves';
    }

    /**
     * Display a listing of rating curves
     */
    public function index(Request $request)
    {
        try {
            // Direct database query instead of API for now
            $ratingCurves = \App\Models\RatingCurve::with('sensor')
                ->paginate($request->get('per_page', 15));
            
            // Get sensors for filter
            $sensors = \App\Models\MasSensor::select('id', 'code', 'description')
                ->where('is_active', true)
                ->get();

            // Prepare table headers
            $tableHeaders = [
                ['key' => 'id', 'label' => 'ID', 'sortable' => true],
                ['key' => 'code', 'label' => 'Code', 'sortable' => true],
                ['key' => 'sensor_name', 'label' => 'Sensor', 'sortable' => false],
                ['key' => 'formula', 'label' => 'Formula', 'sortable' => false],
                ['key' => 'effective_date', 'label' => 'Effective Date', 'sortable' => true],
                ['key' => 'is_active', 'label' => 'Status', 'format' => 'status', 'sortable' => true],
                ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions', 'sortable' => false]
            ];

            // Transform data for table
            $transformedCurves = $ratingCurves->map(function ($curve) {
                return [
                    'id' => $curve->id,
                    'sensor_code' => $curve->mas_sensor_code,
                    'sensor_name' => $curve->sensor->name ?? $curve->mas_sensor_code,
                    'formula' => $curve->formula_string,
                    'formula_type' => $curve->formula_type,
                    'a' => $curve->a,
                    'b' => $curve->b ?? 0,
                    'c' => $curve->c ?? 0,
                    'code' => $curve->code,
                    'effective_date' => $curve->effective_date ? $curve->effective_date->format('d M Y') : '-',
                    'is_active' => 'active',
                    'actions' => [
                        'edit' => true,
                        'delete' => true,
                        'custom' => [
                            [
                                'label' => 'Calculate',
                                'icon' => 'fa-calculator',
                                'event' => 'open-calculate',
                                'class' => 'text-green-600 hover:text-green-900'
                            ]
                        ]
                    ]
                ];
            });

            return view('admin.rating_curves.index', [
                'ratingCurves' => $transformedCurves,
                'tableHeaders' => $tableHeaders,
                'sensors' => $sensors->map(fn($s) => [
                    'value' => $s->code,
                    'label' => $s->name . ' (' . $s->code . ')'
                ]),
                'pagination' => [
                    'current_page' => $ratingCurves->currentPage(),
                    'last_page' => $ratingCurves->lastPage(),
                    'per_page' => $ratingCurves->perPage(),
                    'total' => $ratingCurves->total(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching rating curves: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return empty view instead of redirecting back
            return view('admin.rating_curves.index', [
                'ratingCurves' => collect([]),
                'tableHeaders' => [
                    ['key' => 'id', 'label' => 'ID', 'sortable' => true],
                    ['key' => 'code', 'label' => 'Code', 'sortable' => true],
                    ['key' => 'sensor_name', 'label' => 'Sensor', 'sortable' => false],
                    ['key' => 'formula', 'label' => 'Formula', 'sortable' => false],
                    ['key' => 'effective_date', 'label' => 'Effective Date', 'sortable' => true],
                    ['key' => 'is_active', 'label' => 'Status', 'format' => 'status', 'sortable' => true],
                    ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions', 'sortable' => false]
                ],
                'sensors' => collect([]),
                'pagination' => null
            ])->with('error', 'Failed to load rating curves: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new rating curve
     */
    public function create(Request $request)
    {
        try {
            $token = $request->user()->createToken('admin-access')->plainTextToken;
            
            // Get sensors
            $sensorsResponse = Http::withToken($token)
                ->get(config('app.url') . '/api/sensors');
            $sensors = $sensorsResponse->successful() ? $sensorsResponse->json('data') : [];

            return view('admin.rating_curves.create', [
                'sensors' => collect($sensors)->map(fn($s) => [
                    'value' => $s['code'],
                    'label' => $s['name'] . ' (' . $s['code'] . ')'
                ])
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading create form: ' . $e->getMessage());
            return back()->with('error', 'Failed to load form');
        }
    }

    /**
     * Store a newly created rating curve
     */
    public function store(Request $request)
    {
        try {
            $token = $request->user()->createToken('admin-access')->plainTextToken;
            
            $response = Http::withToken($token)
                ->post($this->apiBaseUrl, $request->all());

            if (!$response->successful()) {
                $error = $response->json('message', 'Failed to create rating curve');
                return back()->withInput()->with('error', $error);
            }

            return redirect()->route('admin.rating-curves.index')
                ->with('success', 'Rating curve created successfully');

        } catch (\Exception $e) {
            Log::error('Error creating rating curve: ' . $e->getMessage());
            return back()->withInput()->with('error', 'Failed to create rating curve');
        }
    }

    /**
     * Show the form for editing a rating curve
     */
    public function edit(Request $request, $id)
    {
        try {
            $token = $request->user()->createToken('admin-access')->plainTextToken;
            
            // Get rating curve
            $response = Http::withToken($token)
                ->get($this->apiBaseUrl . '/' . $id);

            if (!$response->successful()) {
                return back()->with('error', 'Rating curve not found');
            }

            $ratingCurve = $response->json('data');
            
            // Get sensors
            $sensorsResponse = Http::withToken($token)
                ->get(config('app.url') . '/api/sensors');
            $sensors = $sensorsResponse->successful() ? $sensorsResponse->json('data') : [];

            return view('admin.rating_curves.edit', [
                'ratingCurve' => $ratingCurve,
                'sensors' => collect($sensors)->map(fn($s) => [
                    'value' => $s['code'],
                    'label' => $s['name'] . ' (' . $s['code'] . ')'
                ])
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading edit form: ' . $e->getMessage());
            return back()->with('error', 'Failed to load rating curve');
        }
    }

    /**
     * Update the specified rating curve
     */
    public function update(Request $request, $id)
    {
        try {
            $token = $request->user()->createToken('admin-access')->plainTextToken;
            
            $response = Http::withToken($token)
                ->put($this->apiBaseUrl . '/' . $id, $request->all());

            if (!$response->successful()) {
                $error = $response->json('message', 'Failed to update rating curve');
                return back()->withInput()->with('error', $error);
            }

            return redirect()->route('admin.rating-curves.index')
                ->with('success', 'Rating curve updated successfully');

        } catch (\Exception $e) {
            Log::error('Error updating rating curve: ' . $e->getMessage());
            return back()->withInput()->with('error', 'Failed to update rating curve');
        }
    }

    /**
     * Remove the specified rating curve
     */
    public function destroy(Request $request, $id)
    {
        try {
            $token = $request->user()->createToken('admin-access')->plainTextToken;
            
            $response = Http::withToken($token)
                ->delete($this->apiBaseUrl . '/' . $id);

            if (!$response->successful()) {
                return back()->with('error', 'Failed to delete rating curve');
            }

            return redirect()->route('admin.rating-curves.index')
                ->with('success', 'Rating curve deleted successfully');

        } catch (\Exception $e) {
            Log::error('Error deleting rating curve: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete rating curve');
        }
    }

    /**
     * Show calculate discharge page
     */
    public function calculate(Request $request, $id)
    {
        try {
            $token = $request->user()->createToken('admin-access')->plainTextToken;
            
            // Get rating curve
            $response = Http::withToken($token)
                ->get($this->apiBaseUrl . '/' . $id);

            if (!$response->successful()) {
                return back()->with('error', 'Rating curve not found');
            }

            $ratingCurve = $response->json('data');

            return view('admin.rating_curves.calculate', [
                'ratingCurve' => $ratingCurve
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading calculate page: ' . $e->getMessage());
            return back()->with('error', 'Failed to load calculator');
        }
    }
}

