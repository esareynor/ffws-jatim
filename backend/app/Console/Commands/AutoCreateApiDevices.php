<?php

namespace App\Console\Commands;

use App\Models\ApiDataSource;
use App\Services\ApiDataFetchService;
use App\Services\ApiDeviceAutoCreateService;
use Illuminate\Console\Command;

class AutoCreateApiDevices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sensor:auto-create-api-devices
                          {--source= : Specific API source code to process}
                          {--dry-run : Preview what would be created without actually creating}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto-create devices and sensors from API data sources';

    protected $autoCreateService;
    protected $fetchService;

    public function __construct(
        ApiDeviceAutoCreateService $autoCreateService,
        ApiDataFetchService $fetchService
    ) {
        parent::__construct();
        $this->autoCreateService = $autoCreateService;
        $this->fetchService = $fetchService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Auto-creating devices and sensors from API sources...');
        $this->newLine();

        // Get API sources
        $sources = $this->getApiSources();

        if ($sources->isEmpty()) {
            $this->warn('No API data sources found.');
            return 1;
        }

        $totalCreated = 0;
        $totalFailed = 0;
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('🔍 DRY RUN MODE - No actual changes will be made');
            $this->newLine();
        }

        foreach ($sources as $source) {
            $this->info("📡 Processing: {$source->name} ({$source->code})");

            try {
                // Fetch data from API
                $this->line('   Fetching data from API...');
                $testResult = $this->fetchService->testConnection($source);

                if (!$testResult['success']) {
                    $this->error("   ❌ Connection failed: {$testResult['message']}");
                    continue;
                }

                $records = $testResult['sample_data'] ?? [];
                $totalRecords = $testResult['total_records'] ?? 0;

                $this->info("   ✅ Fetched {$totalRecords} records");

                if (empty($records)) {
                    $this->warn('   ⚠️  No sample data available');
                    continue;
                }

                // Parse full data if not in dry-run
                if (!$dryRun) {
                    // Use reflection to access protected methods
                    $reflection = new \ReflectionClass($this->fetchService);

                    $buildMethod = $reflection->getMethod('buildHttpClient');
                    $buildMethod->setAccessible(true);
                    $http = $buildMethod->invoke($this->fetchService, $source);

                    $executeMethod = $reflection->getMethod('executeRequest');
                    $executeMethod->setAccessible(true);
                    $response = $executeMethod->invoke($this->fetchService, $http, $source);

                    $parseMethod = $reflection->getMethod('parseResponse');
                    $parseMethod->setAccessible(true);
                    $allData = $parseMethod->invoke($this->fetchService, $response, $source);
                } else {
                    $allData = $records; // Only use sample in dry-run
                }

                // Auto-create devices and sensors
                $this->line("   Creating devices and sensors...");

                if ($dryRun) {
                    // Preview mode
                    foreach ($allData as $index => $record) {
                        $fieldMap = $source->data_mapping['fields'] ?? [];
                        $externalId = $this->extractValue($record, $fieldMap['external_id'] ?? 'kode');
                        $name = $this->extractValue($record, $fieldMap['name'] ?? 'judul');

                        $this->line("   [{$index}] Would create:");
                        $this->line("       External ID: {$externalId}");
                        $this->line("       Name: {$name}");
                    }
                    $totalCreated += count($allData);
                } else {
                    // Actually create
                    $results = $this->autoCreateService->batchAutoCreate($allData, $source);

                    $this->info("   ✅ Created: {$results['success']}");
                    if ($results['failed'] > 0) {
                        $this->warn("   ⚠️  Failed: {$results['failed']}");
                        foreach ($results['errors'] as $error) {
                            $this->line("       - {$error['error']}");
                        }
                    }

                    $totalCreated += $results['success'];
                    $totalFailed += $results['failed'];
                }

            } catch (\Exception $e) {
                $this->error("   ❌ Error: {$e->getMessage()}");
                continue;
            }

            $this->newLine();
        }

        // Summary
        $this->newLine();
        $this->info('📊 Summary:');
        $this->info("   ✅ Successfully created: {$totalCreated}");
        if ($totalFailed > 0) {
            $this->warn("   ❌ Failed: {$totalFailed}");
        }

        if ($dryRun) {
            $this->newLine();
            $this->info('💡 Run without --dry-run to actually create the devices and sensors');
        }

        return 0;
    }

    /**
     * Get API sources to process
     */
    protected function getApiSources()
    {
        $sourceCode = $this->option('source');

        if ($sourceCode) {
            return ApiDataSource::where('code', $sourceCode)->get();
        }

        return ApiDataSource::where('is_active', true)->get();
    }

    /**
     * Extract value using dot notation
     */
    protected function extractValue(array $data, ?string $path)
    {
        if ($path === null) {
            return null;
        }

        $keys = explode('.', $path);
        $value = $data;

        foreach ($keys as $key) {
            if (is_array($value) && isset($value[$key])) {
                $value = $value[$key];
            } else {
                return null;
            }
        }

        return $value;
    }
}

