<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MonitoringTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test health endpoint returns proper structure
     */
    public function test_health_endpoint_returns_proper_structure()
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'status',
                    'timestamp',
                    'version',
                    'environment',
                    'checks' => [
                        'database' => ['status'],
                        'cache' => ['status'],
                        'storage' => ['status'],
                        'memory' => ['status']
                    ],
                    'uptime'
                ]);
    }

    /**
     * Test monitoring metrics endpoint
     */
    public function test_monitoring_metrics_endpoint()
    {
        $response = $this->get('/api/monitoring/metrics');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'timestamp',
                    'security',
                    'system',
                    'database',
                    'cache',
                    'api'
                ]);
    }

    /**
     * Test monitoring health status endpoint
     */
    public function test_monitoring_health_status_endpoint()
    {
        $response = $this->get('/api/monitoring/health-status');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'status',
                    'checks' => [
                        'database' => ['status'],
                        'cache' => ['status'],
                        'storage' => ['status']
                    ],
                    'timestamp'
                ]);
    }

    /**
     * Test security alerts endpoint
     */
    public function test_security_alerts_endpoint()
    {
        $response = $this->get('/api/monitoring/security-alerts');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'alerts',
                    'total',
                    'timestamp'
                ]);
    }

    /**
     * Test that health check returns healthy status with working database
     */
    public function test_health_check_returns_healthy_with_working_database()
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200);
        
        $data = $response->json();
        $this->assertEquals('healthy', $data['status']);
        $this->assertEquals('healthy', $data['checks']['database']['status']);
    }

    /**
     * Test monitoring service can be instantiated
     */
    public function test_monitoring_service_can_be_instantiated()
    {
        $monitoringService = app(\App\Services\MonitoringService::class);
        $this->assertInstanceOf(\App\Services\MonitoringService::class, $monitoringService);
    }

    /**
     * Test monitoring service health check method
     */
    public function test_monitoring_service_health_check_method()
    {
        $monitoringService = app(\App\Services\MonitoringService::class);
        $healthData = $monitoringService->checkHealth();

        $this->assertIsArray($healthData);
        $this->assertArrayHasKey('status', $healthData);
        $this->assertArrayHasKey('checks', $healthData);
        $this->assertArrayHasKey('timestamp', $healthData);
    }
}
