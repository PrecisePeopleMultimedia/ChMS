<template>
  <q-page class="quasar-prime-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header q-pa-lg">
      <div class="row items-center justify-between">
        <div class="col">
          <h1 class="text-h4 font-bold text-foreground">
            Welcome, {{ authStore.user?.first_name || authStore.user?.name || 'User' }}!
          </h1>
          <p class="text-subtitle1 text-muted-foreground">
            ChurchAfrica Dashboard
          </p>
        </div>
        <div class="col-auto">
          <q-btn
            @click="handleLogout"
            color="negative"
            icon="logout"
            label="Logout"
            :loading="isLoggingOut"
            class="logout-btn"
          />
        </div>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div class="dashboard-content q-pa-lg">
      <div class="row q-gutter-lg">
        <!-- Site Performance Metrics Card -->
        <div class="col-12 col-md-8">
          <q-card class="quasar-prime-card performance-card">
            <q-card-section class="card-header">
              <div class="text-h6 text-weight-bold">Site Performance Metrics</div>
              <div class="text-subtitle2 text-muted-foreground">
                The conversion rate is a total of 28.5%.
              </div>
            </q-card-section>
            
            <q-card-section class="q-pt-none">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="metric-box">
                    <div class="metric-value">5.5k</div>
                    <div class="metric-label">Sessions</div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="metric-box">
                    <div class="metric-value">8.1k</div>
                    <div class="metric-label">Page Views</div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="metric-box">
                    <div class="metric-value">8.2k</div>
                    <div class="metric-label">Leads</div>
                  </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                  <div class="metric-box">
                    <div class="metric-value">72%</div>
                    <div class="metric-label">Conversions</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Income Earned Card -->
        <div class="col-12 col-md-4">
          <q-card class="quasar-prime-card income-card">
            <q-card-section class="card-header">
              <div class="text-h6 text-weight-bold">Income Earned</div>
            </q-card-section>
            
            <q-card-section class="q-pt-none">
              <div class="income-value">87.5k</div>
              <div class="income-chart">
                <q-linear-progress 
                  :value="0.75" 
                  color="positive" 
                  track-color="grey-4"
                  rounded
                  size="8px"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Sales Summary Card -->
        <div class="col-12 col-md-6">
          <q-card class="quasar-prime-card sales-card">
            <q-card-section class="card-header">
              <div class="text-h6 text-weight-bold">Sales Summary</div>
              <div class="text-subtitle2 text-positive">+18.2%</div>
            </q-card-section>
            
            <q-card-section class="q-pt-none">
              <div class="sales-value">$87.5k</div>
              <div class="row q-gutter-sm q-mt-md">
                <q-btn
                  color="primary"
                  icon="description"
                  label="Request"
                  class="sales-btn"
                />
                <q-btn
                  color="secondary"
                  icon="phone"
                  label="Calls"
                  class="sales-btn"
                />
              </div>
              <div class="row q-gutter-md q-mt-md">
                <div class="col">
                  <div class="text-caption text-muted-foreground">62.2% (6,440)</div>
                  <q-linear-progress :value="0.622" color="primary" size="4px" />
                </div>
                <div class="col">
                  <div class="text-caption text-muted-foreground">25.5% (12,749)</div>
                  <q-linear-progress :value="0.255" color="secondary" size="4px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Issue Resolution Tracker Card -->
        <div class="col-12 col-md-6">
          <q-card class="quasar-prime-card issue-card">
            <q-card-section class="card-header">
              <div class="text-h6 text-weight-bold">Issue Resolution Tracker</div>
              <div class="text-subtitle2 text-muted-foreground">Last 17 Days</div>
            </q-card-section>
            
            <q-card-section class="q-pt-none">
              <div class="issue-value">164</div>
              <div class="text-caption text-muted-foreground q-mb-md">Aggregate Tickets</div>
              
              <div class="row q-gutter-sm">
                <div class="col-12 col-sm-4">
                  <div class="issue-item">
                    <q-icon name="description" color="primary" size="sm" />
                    <div class="text-caption">New Support Tickets</div>
                    <div class="text-subtitle2">142 New Tickets</div>
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="issue-item">
                    <q-icon name="schedule" color="positive" size="sm" />
                    <div class="text-caption">Open Customer Inquiries</div>
                    <div class="text-subtitle2">28 Open Tickets</div>
                  </div>
                </div>
                <div class="col-12 col-sm-4">
                  <div class="issue-item">
                    <q-icon name="access_time" color="negative" size="sm" />
                    <div class="text-caption">Average Response Time</div>
                    <div class="text-subtitle2">1 Day Response Time</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Weekly Earnings Card -->
        <div class="col-12">
          <q-card class="quasar-prime-card earnings-card">
            <q-card-section class="card-header">
              <div class="text-h6 text-weight-bold">Summary of Weekly Earnings</div>
              <div class="text-subtitle2 text-muted-foreground">Income Statements</div>
            </q-card-section>
            
            <q-card-section class="q-pt-none">
              <div class="row q-col-gutter-lg">
                <div class="col-12 col-md-6">
                  <div class="earnings-value">$468</div>
                  <div class="text-subtitle2 text-positive">+4.2%</div>
                  <div class="text-caption text-muted-foreground q-mt-sm">
                    Provide a comparison of this week to the previous week
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="earnings-breakdown">
                    <div class="breakdown-item">
                      <div class="text-caption">Income</div>
                      <div class="text-subtitle2">$3345.69</div>
                    </div>
                    <div class="breakdown-item">
                      <div class="text-caption">Financial gain</div>
                      <div class="text-subtitle2 text-positive">$236.34</div>
                    </div>
                    <div class="breakdown-item">
                      <div class="text-caption">Spending</div>
                      <div class="text-subtitle2 text-negative">$74.19</div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const isLoggingOut = ref(false)

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await authStore.logout()
    $q.notify({
      type: 'positive',
      message: 'You have been logged out successfully.',
      position: 'top'
    })
    router.push('/login')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Logout failed. Please try again.',
      position: 'top'
    })
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style lang="sass" scoped>
.quasar-prime-dashboard
  background: var(--main-bg)
  min-height: 100vh

.dashboard-header
  background: var(--card-bg)
  border-bottom: 1px solid var(--border)
  margin-bottom: 24px

.dashboard-content
  max-width: 1200px
  margin: 0 auto

.quasar-prime-card
  background: var(--card-bg)
  border: 1px solid var(--border)
  border-radius: 12px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  transition: all 0.3s ease
  
  &:hover
    transform: translateY(-2px)
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15)

.card-header
  border-bottom: 1px solid var(--border)
  padding-bottom: 16px

.performance-card
  .metric-box
    text-align: center
    padding: 16px
    background: var(--metric-bg)
    border-radius: 8px
    border: 1px solid var(--border)
    
    .metric-value
      font-size: 1.5rem
      font-weight: bold
      color: var(--primary)
      margin-bottom: 4px
    
    .metric-label
      font-size: 0.875rem
      color: var(--muted-foreground)

.income-card
  .income-value
    font-size: 2rem
    font-weight: bold
    color: var(--primary)
    margin-bottom: 16px

.sales-card
  .sales-value
    font-size: 1.5rem
    font-weight: bold
    color: var(--foreground)
    margin-bottom: 16px
  
  .sales-btn
    min-width: 100px

.issue-card
  .issue-value
    font-size: 2rem
    font-weight: bold
    color: var(--primary)
    margin-bottom: 8px
  
  .issue-item
    text-align: center
    padding: 8px
    background: var(--metric-bg)
    border-radius: 6px
    border: 1px solid var(--border)

.earnings-card
  .earnings-value
    font-size: 2rem
    font-weight: bold
    color: var(--primary)
    margin-bottom: 8px
  
  .earnings-breakdown
    .breakdown-item
      display: flex
      justify-content: space-between
      align-items: center
      padding: 8px 0
      border-bottom: 1px solid var(--border)
      
      &:last-child
        border-bottom: none

.logout-btn
  border-radius: 8px

/* Light mode variables */
:root
  --main-bg: #f8f9fa
  --card-bg: #ffffff
  --border: #e9ecef
  --metric-bg: #f8f9fa
  --primary: #8B1538
  --foreground: #1a1a1a
  --muted-foreground: #6c757d

/* Dark mode variables */
.dark
  --main-bg: #0d1117
  --card-bg: #1a1a1a
  --border: #3d3d3d
  --metric-bg: #2d2d2d
  --primary: #B8336A
  --foreground: #ffffff
  --muted-foreground: #8b949e
</style>
