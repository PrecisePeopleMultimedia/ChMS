<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="church-info-card">
      <q-img
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop"
        style="height: 200px"
        class="church-image"
      >
        <div class="absolute-bottom text-h6 text-white bg-transparent">
          <div class="q-pa-md">
            <div class="text-h5 text-weight-bold">Welcome to ChurchAfrica</div>
            <div class="text-subtitle1">Building communities across Africa</div>
          </div>
        </div>
      </q-img>

      <q-card-section>
        <div class="text-h6 q-mb-md">Church Information</div>
        
        <div class="row q-gutter-md">
          <div class="col">
            <q-item class="q-pa-none">
              <q-item-section avatar>
                <q-icon name="location_on" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Location</q-item-label>
                <q-item-label caption>Lagos, Nigeria</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          
          <div class="col">
            <q-item class="q-pa-none">
              <q-item-section avatar>
                <q-icon name="schedule" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Service Times</q-item-label>
                <q-item-label caption>Sun 9AM, Wed 7PM</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <div class="row q-gutter-md q-mt-sm">
          <div class="col">
            <q-item class="q-pa-none">
              <q-item-section avatar>
                <q-icon name="phone" color="accent" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Contact</q-item-label>
                <q-item-label caption>+234 123 456 7890</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          
          <div class="col">
            <q-item class="q-pa-none">
              <q-item-section avatar>
                <q-icon name="email" color="positive" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Email</q-item-label>
                <q-item-label caption>info@churchafrica.org</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="around">
        <q-btn flat color="primary" icon="edit" label="Edit Info" />
        <q-btn flat color="secondary" icon="share" label="Share" />
        <q-btn flat color="accent" icon="print" label="Print" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
// No script needed for this static component
</script>

<style lang="sass" scoped>
.church-info-card
  .church-image
    position: relative
    
    .absolute-bottom
      background: linear-gradient(transparent, rgba(0,0,0,0.7))
</style>
