# Organization Setup - Implementation Plan

## Feature: Organization Setup System
**Epic:** Foundation
**Specification:** [spec.md](./spec.md)
**Estimated Effort:** 2-3 days
**Priority:** P0 (Foundation - Required before any other features)
**Dependencies:** Authentication System (Spec 000)
**Africa-First Focus:** Simple setup, offline-capable, minimal data requirements

## Implementation Phases

### **Phase 1: Core Organization Setup (P0) - CRITICAL**
**Estimated Time:** 12-16 hours

#### **Component 1A: Organization Profile Creation** (4-5 hours)
- **Priority:** Critical - Foundation for entire system
- **Implementation:** Basic church information capture and validation
- **Africa-First Consideration:** Minimal required fields, optional advanced fields
- **Mobile-First:** Single-column layout, large touch targets

#### **Component 1B: Service Schedule Configuration** (3-4 hours)
- **Priority:** Critical - Required for attendance system
- **Implementation:** Flexible service time setup with multiple services per day
- **Africa-First Consideration:** Support for multiple services (morning, evening, midweek)
- **Validation:** Prevent overlapping service times

#### **Component 1C: Administrator Account Setup** (2-3 hours)
- **Priority:** Critical - Required for system access
- **Implementation:** Link organization to admin user account
- **Integration:** Connect with authentication system
- **Security:** Ensure proper role assignment

#### **Component 1D: Settings and Preferences** (3-4 hours)
- **Priority:** High - System configuration
- **Implementation:** Timezone, language, notification preferences
- **Africa-First Consideration:** Default to African timezones and settings
- **Extensibility:** Flexible settings system for future features

## Technical Architecture

### Backend Implementation (Laravel)

#### **API Endpoints**
```php
// Organization Management Controller
class OrganizationController extends Controller
{
    public function store(Request $request)
    {
        // Create new organization with validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'description' => 'nullable|string',
            'timezone' => 'required|string|max:50'
        ]);
        
        $organization = Organization::create($validated);
        
        // Assign current user as admin
        $request->user()->update([
            'organization_id' => $organization->id,
            'role' => 'admin'
        ]);
        
        return response()->json($organization, 201);
    }
    
    public function show(Organization $organization)
    {
        $this->authorize('view', $organization);
        return response()->json($organization->load('settings', 'serviceSchedules'));
    }
    
    public function update(Request $request, Organization $organization)
    {
        $this->authorize('update', $organization);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'description' => 'nullable|string',
            'timezone' => 'sometimes|required|string|max:50'
        ]);
        
        $organization->update($validated);
        return response()->json($organization);
    }
}
```

#### **Models and Relationships**
```php
// Organization Model
class Organization extends Model
{
    protected $fillable = [
        'name', 'address', 'phone', 'email', 
        'website', 'description', 'timezone'
    ];
    
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
    public function users()
    {
        return $this->hasMany(User::class);
    }
    
    public function settings()
    {
        return $this->hasMany(OrganizationSetting::class);
    }
    
    public function serviceSchedules()
    {
        return $this->hasMany(ServiceSchedule::class);
    }
    
    public function getSetting($key, $default = null)
    {
        $setting = $this->settings()->where('setting_key', $key)->first();
        return $setting ? $setting->setting_value : $default;
    }
    
    public function setSetting($key, $value)
    {
        return $this->settings()->updateOrCreate(
            ['setting_key' => $key],
            ['setting_value' => $value]
        );
    }
}

// Service Schedule Model
class ServiceSchedule extends Model
{
    protected $fillable = [
        'organization_id', 'name', 'day_of_week', 
        'start_time', 'end_time', 'is_active'
    ];
    
    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'is_active' => 'boolean'
    ];
    
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }
    
    public function getDayNameAttribute()
    {
        $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return $days[$this->day_of_week];
    }
}
```

### Frontend Implementation (Vue 3 + Quasar)

#### **Main Setup Wizard Component**
```javascript
// OrganizationSetup.vue
<template>
  <q-stepper
    v-model="step"
    vertical
    color="primary"
    animated
    class="organization-setup"
  >
    <q-step
      :name="1"
      title="Church Information"
      icon="church"
      :done="step > 1"
    >
      <ChurchProfileForm
        v-model="organizationData"
        @next="step = 2"
        @validate="validateStep1"
      />
    </q-step>

    <q-step
      :name="2"
      title="Service Schedule"
      icon="schedule"
      :done="step > 2"
    >
      <ServiceScheduleForm
        v-model="serviceSchedules"
        @next="step = 3"
        @back="step = 1"
      />
    </q-step>

    <q-step
      :name="3"
      title="Settings & Preferences"
      icon="settings"
      :done="step > 3"
    >
      <SettingsForm
        v-model="settings"
        @complete="completeSetup"
        @back="step = 2"
      />
    </q-step>
  </q-stepper>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useOrganizationStore } from '@/stores/organization'

const router = useRouter()
const organizationStore = useOrganizationStore()

const step = ref(1)
const organizationData = reactive({
  name: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  description: '',
  timezone: 'Africa/Lagos'
})

const serviceSchedules = ref([])
const settings = reactive({
  language: 'en',
  notifications_enabled: true,
  default_service_duration: 120
})

const completeSetup = async () => {
  try {
    // Create organization
    const organization = await organizationStore.createOrganization(organizationData)
    
    // Add service schedules
    for (const schedule of serviceSchedules.value) {
      await organizationStore.addServiceSchedule(organization.id, schedule)
    }
    
    // Save settings
    for (const [key, value] of Object.entries(settings)) {
      await organizationStore.setSetting(organization.id, key, value)
    }
    
    // Navigate to dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Setup failed:', error)
  }
}
</script>
```

## Offline Implementation Strategy

### **Local Storage Architecture**
- **Setup Progress:** Track completion status in localStorage
- **Form Data:** Auto-save form data as user types
- **Validation:** Client-side validation for immediate feedback
- **Sync Queue:** Queue setup data for server sync when online

### **Conflict Resolution**
- **Setup Priority:** Local setup data takes precedence
- **Server Validation:** Validate against server constraints when syncing
- **Error Handling:** Clear error messages for sync failures

## Africa-First Considerations

### **Minimal Data Requirements**
- **Required Fields:** Only church name and timezone
- **Optional Fields:** All other information can be added later
- **Progressive Enhancement:** Add more details as needed

### **Timezone Defaults**
- **Default Timezone:** Africa/Lagos (most common)
- **Common Options:** Africa/Cairo, Africa/Johannesburg, Africa/Nairobi
- **Auto-Detection:** Attempt browser timezone detection with African fallback

### **Mobile-First Design**
- **Single Column Layout:** Optimized for mobile screens
- **Large Touch Targets:** Easy interaction on touch devices
- **Minimal Scrolling:** Keep forms concise and focused

## Success Criteria

### **Phase 1 Success (P0 - Core Setup)**
- [ ] Church administrators can create organization profile
- [ ] Service schedules can be configured with multiple services
- [ ] Administrator account properly linked to organization
- [ ] Basic settings and preferences saved
- [ ] Setup wizard works completely offline
- [ ] Data syncs properly when connection available
- [ ] Mobile-optimized interface works on Android devices
- [ ] Setup completes in under 10 minutes for typical church

## Risk Mitigation

### **User Experience Risks**
- **Risk:** Complex setup process overwhelming users
- **Mitigation:** Progressive disclosure, optional fields, clear progress indicators
- **Alternative:** Minimal setup with post-setup configuration options

### **Data Validation Risks**
- **Risk:** Invalid data causing system issues
- **Mitigation:** Comprehensive client and server-side validation
- **Fallback:** Admin tools to fix invalid organization data

### **Offline Sync Risks**
- **Risk:** Setup data lost during offline-to-online transition
- **Mitigation:** Robust local storage, sync confirmation, error recovery
- **Monitoring:** Track setup completion rates and sync success

## Current Implementation Status
- 🚧 **Organization Profile Creation:** 0% complete (needs implementation)
- 🚧 **Service Schedule Configuration:** 0% complete (needs implementation)
- 🚧 **Administrator Account Setup:** 0% complete (needs implementation)
- 🚧 **Settings and Preferences:** 0% complete (needs implementation)
- 🚧 **Offline Setup Capability:** 0% complete (needs implementation)

## Next Steps
1. **Implement Organization model and API endpoints**
2. **Create setup wizard Vue components**
3. **Implement offline storage and sync**
4. **Add comprehensive validation**
5. **Test setup flow on mobile devices**
6. **Integrate with authentication system**

---

This implementation plan ensures a smooth, Africa-first organization setup experience that works offline and provides a solid foundation for all other ChMS features.
