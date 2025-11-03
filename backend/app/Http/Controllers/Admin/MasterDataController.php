<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Unified controller for all master data management
 * Handles: Cities, Provinces, Regencies, Villages, Watersheds, UPTs, UPTDs
 */
class MasterDataController extends Controller
{
    private $apiBaseUrl;

    public function __construct()
    {
        $this->apiBaseUrl = config('app.url') . '/api/admin';
    }

    /**
     * Get auth token for API requests
     */
    private function getToken(Request $request)
    {
        return $request->user()->createToken('admin-access')->plainTextToken;
    }

    /**
     * Generic CRUD view method for master data
     */
    private function crudView(Request $request, string $endpoint, string $singular, string $plural, string $description, array $fields)
    {
        try {
            $token = $this->getToken($request);
            
            $response = Http::withToken($token)
                ->timeout(10)
                ->get($this->apiBaseUrl . '/' . $endpoint);

            $items = [];
            if ($response->successful()) {
                $data = $response->json('data');
                $items = is_array($data) ? $data : [];
            }
            
            return view('admin.master_data._generic_crud', [
                'items' => $items,
                'endpoint' => $endpoint,
                'singular' => $singular,
                'plural' => $plural,
                'title' => $plural . ' Management',
                'description' => $description,
                'fields' => $fields
            ]);

        } catch (\Exception $e) {
            Log::error("Error fetching {$plural}: " . $e->getMessage());
            
            return view('admin.master_data._generic_crud', [
                'items' => [],
                'endpoint' => $endpoint,
                'singular' => $singular,
                'plural' => $plural,
                'title' => $plural . ' Management',
                'description' => $description,
                'fields' => $fields
            ])->with('warning', "Could not load data from API.");
        }
    }

    // ==================== CITIES ====================
    public function citiesIndex(Request $request)
    {
        return $this->crudView(
            $request,
            'cities',
            'City',
            'Cities',
            'Manage city master data',
            [
                ['name' => 'code', 'label' => 'Code', 'required' => true],
                ['name' => 'name', 'label' => 'Name', 'required' => true]
            ]
        );
    }

    // ==================== PROVINCES ====================
    public function provincesIndex(Request $request)
    {
        return $this->crudView(
            $request,
            'provinces',
            'Province',
            'Provinces',
            'Manage province master data',
            [
                ['name' => 'provinces_code', 'label' => 'Code', 'required' => true],
                ['name' => 'provinces_name', 'label' => 'Name', 'required' => true]
            ]
        );
    }

    // ==================== REGENCIES ====================
    public function regenciesIndex(Request $request)
    {
        return $this->crudView(
            $request,
            'regencies',
            'Regency',
            'Regencies',
            'Manage regency master data',
            [
                ['name' => 'regencies_code', 'label' => 'Code', 'required' => true],
                ['name' => 'regencies_name', 'label' => 'Name', 'required' => true]
            ]
        );
    }

    // ==================== VILLAGES ====================
    public function villagesIndex(Request $request)
    {
        return $this->crudView(
            $request,
            'villages',
            'Village',
            'Villages',
            'Manage village master data',
            [
                ['name' => 'code', 'label' => 'Code', 'required' => true],
                ['name' => 'name', 'label' => 'Name', 'required' => true]
            ]
        );
    }

    // ==================== WATERSHEDS ====================
    public function watershedsIndex(Request $request)
    {
        return $this->crudView(
            $request,
            'watersheds',
            'Watershed',
            'Watersheds',
            'Manage watershed master data',
            [
                ['name' => 'code', 'label' => 'Code', 'required' => true],
                ['name' => 'name', 'label' => 'Name', 'required' => true],
                ['name' => 'river_basin_code', 'label' => 'River Basin Code', 'required' => true]
            ]
        );
    }

    // ==================== UPTs ====================
    public function uptsIndex(Request $request)
    {
        return $this->crudView(
            $request,
            'upts',
            'UPT',
            'UPTs',
            'Manage UPT master data',
            [
                ['name' => 'code', 'label' => 'Code', 'required' => true],
                ['name' => 'name', 'label' => 'Name', 'required' => true],
                ['name' => 'river_basin_code', 'label' => 'River Basin Code', 'required' => true],
                ['name' => 'cities_code', 'label' => 'City Code', 'required' => true]
            ]
        );
    }

    // ==================== UPTDs ====================
    public function uptdsIndex(Request $request)
    {
        return $this->crudView(
            $request,
            'uptds',
            'UPTD',
            'UPTDs',
            'Manage UPTD master data',
            [
                ['name' => 'code', 'label' => 'Code', 'required' => true],
                ['name' => 'name', 'label' => 'Name', 'required' => true],
                ['name' => 'upt_code', 'label' => 'UPT Code', 'required' => true]
            ]
        );
    }
}
