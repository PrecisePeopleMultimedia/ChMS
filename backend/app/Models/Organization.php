<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'website',
        'description',
        'timezone',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the users for the organization.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the settings for the organization.
     */
    public function settings(): HasMany
    {
        return $this->hasMany(OrganizationSetting::class);
    }

    /**
     * Get the service schedules for the organization.
     */
    public function serviceSchedules(): HasMany
    {
        return $this->hasMany(ServiceSchedule::class);
    }

    /**
     * Get a specific setting value.
     */
    public function getSetting(string $key, $default = null)
    {
        $setting = $this->settings()->where('setting_key', $key)->first();
        return $setting ? $setting->setting_value : $default;
    }

    /**
     * Set a specific setting value.
     */
    public function setSetting(string $key, $value): void
    {
        $this->settings()->updateOrCreate(
            ['setting_key' => $key],
            ['setting_value' => $value]
        );
    }
}
