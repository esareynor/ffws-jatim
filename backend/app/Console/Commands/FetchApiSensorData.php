<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ApiDataFetchService;
use App\Models\ApiDataSource;

class FetchApiSensorData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sensor:fetch-api-data
                            {--source= : Specific data source code to fetch}
                            {--force : Force fetch even if interval not reached}
                            {--test : Test connection without saving data}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch sensor data from external APIs';

    protected $fetchService;

    public function __construct(ApiDataFetchService $fetchService)
    {
        parent::__construct();
        $this->fetchService = $fetchService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting API sensor data fetch...');

        $sourceCode = $this->option('source');
        $isTest = $this->option('test');

        if ($sourceCode) {
            // Fetch from specific source
            $source = ApiDataSource::where('code', $sourceCode)->first();

            if (!$source) {
                $this->error("Data source not found: {$sourceCode}");
                return 1;
            }

            if ($isTest) {
                $this->testSource($source);
            } else {
                $this->fetchFromSource($source);
            }
        } else {
            // Fetch from all active sources
            $sources = ApiDataSource::where('is_active', true)->get();

            if ($sources->isEmpty()) {
                $this->warn('No active data sources found.');
                return 0;
            }

            $this->info("Found {$sources->count()} active data source(s)");

            foreach ($sources as $source) {
                // Check if should fetch (unless forced)
                if (!$this->option('force') && !$source->shouldFetch()) {
                    $this->line("⏭️  Skipping {$source->name} - not yet time to fetch");
                    continue;
                }

                if ($isTest) {
                    $this->testSource($source);
                } else {
                    $this->fetchFromSource($source);
                }
            }
        }

        $this->info('✅ Fetch process completed!');
        return 0;
    }

    protected function fetchFromSource(ApiDataSource $source)
    {
        $this->line("📡 Fetching from: {$source->name}");

        $result = $this->fetchService->fetchFromSource($source);

        if ($result['success']) {
            $data = $result['data'];
            $this->info("✅ Success - Fetched: {$data['fetched']}, Saved: {$data['saved']}, Failed: {$data['failed']}");
        } else {
            $this->error("❌ Failed: {$result['message']}");
        }
    }

    protected function testSource(ApiDataSource $source)
    {
        $this->line("🧪 Testing connection: {$source->name}");

        $result = $this->fetchService->testConnection($source);

        if ($result['success']) {
            $this->info("✅ Connection successful");
            $this->line("Total records: {$result['total_records']}");

            if (!empty($result['sample_data'])) {
                $this->line("\nSample data:");
                $this->table(
                    ['Field', 'Value'],
                    collect($result['sample_data'][0] ?? [])->map(fn($v, $k) => [$k, is_array($v) ? json_encode($v) : $v])
                );
            }
        } else {
            $this->error("❌ Connection failed: {$result['message']}");
        }
    }
}
