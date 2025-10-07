import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useQuasar } from 'quasar';
import AttendanceScanner from '../AttendanceScanner.vue';

// Mock Quasar
vi.mock('quasar', () => ({
  useQuasar: vi.fn(() => ({
    notify: vi.fn(),
    screen: { lt: { md: false } }
  }))
}));

// Mock QuaggaJS
vi.mock('quagga', () => ({
  default: {
    init: vi.fn((config, callback) => {
      callback(null);
      return {
        start: vi.fn(),
        stop: vi.fn(),
        onDetected: vi.fn()
      };
    })
  }
}));

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn(() => Promise.resolve({
      getTracks: () => [{ stop: vi.fn() }]
    }))
  },
  writable: true
});

describe('AttendanceScanner', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should render scanner interface', () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    expect(wrapper.find('.qr-scanner-container').exists()).toBe(true);
    expect(wrapper.find('.scanner-header').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toContain('QR Code Scanner');
  });

  it('should show camera placeholder when not scanning', () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    expect(wrapper.find('.camera-placeholder').exists()).toBe(true);
    expect(wrapper.find('.camera-view').exists()).toBe(false);
  });

  it('should show start scanner button when not scanning', () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    const startButton = wrapper.find('button:has-text("Start Scanner")');
    expect(startButton.exists()).toBe(true);
  });

  it('should emit switch-to-manual when manual fallback is clicked', async () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    const manualButton = wrapper.find('button:has-text("Manual Check-in")');
    await manualButton.trigger('click');

    expect(wrapper.emitted('switch-to-manual')).toBeTruthy();
  });

  it('should handle camera access error gracefully', async () => {
    // Mock camera access denied
    navigator.mediaDevices.getUserMedia = vi.fn(() => 
      Promise.reject(new Error('Camera access denied'))
    );

    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    const startButton = wrapper.find('button:has-text("Start Scanner")');
    await startButton.trigger('click');

    // Wait for error to be processed
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.find('.error-message').text()).toContain('Camera access denied');
  });

  it('should show error message when camera is not supported', () => {
    // Mock no camera support
    Object.defineProperty(navigator, 'mediaDevices', {
      value: undefined,
      writable: true
    });

    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.find('.error-message').text()).toContain('Camera not supported');
  });

  it('should display scan result when QR code is detected', async () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    // Mock successful QR code detection
    wrapper.vm.handleQRCodeDetected = vi.fn().mockResolvedValue(undefined);
    wrapper.vm.scanResult = {
      member: { name: 'John Doe' },
      qr_code_data: 'test-qr-data'
    };

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.scan-result').exists()).toBe(true);
    expect(wrapper.find('.scan-result-card').exists()).toBe(true);
    expect(wrapper.find('.scan-result').text()).toContain('John Doe');
  });

  it('should emit check-in-success when check-in is processed', async () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    // Mock scan result
    wrapper.vm.scanResult = {
      member: { name: 'John Doe' },
      qr_code_data: 'test-qr-data'
    };

    // Mock successful check-in
    wrapper.vm.processCheckIn = vi.fn().mockResolvedValue(undefined);

    await wrapper.vm.$nextTick();

    const checkInButton = wrapper.find('button:has-text("Check In")');
    await checkInButton.trigger('click');

    expect(wrapper.emitted('check-in-success')).toBeTruthy();
  });

  it('should show loading state during check-in processing', async () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.isProcessing = true;
    await wrapper.vm.$nextTick();

    const checkInButton = wrapper.find('button:has-text("Check In")');
    expect(checkInButton.attributes('loading')).toBeDefined();
  });

  it('should clear error when dismiss button is clicked', async () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    // Set error state
    wrapper.vm.error = 'Test error';
    await wrapper.vm.$nextTick();

    const dismissButton = wrapper.find('button:has-text("Dismiss")');
    await dismissButton.trigger('click');

    expect(wrapper.vm.error).toBeNull();
  });

  it('should toggle flash when flash button is clicked', async () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    // Mock stream with video track
    const mockStream = {
      getVideoTracks: () => [{
        getCapabilities: () => ({ torch: true }),
        applyConstraints: vi.fn()
      }]
    };

    wrapper.vm.stream = mockStream;
    wrapper.vm.isScanning = true;

    await wrapper.vm.$nextTick();

    const flashButton = wrapper.find('button[icon="flash_on"]');
    await flashButton.trigger('click');

    expect(wrapper.vm.flashOn).toBe(true);
  });

  it('should stop scanner when stop button is clicked', async () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    wrapper.vm.isScanning = true;
    await wrapper.vm.$nextTick();

    const stopButton = wrapper.find('button:has-text("Stop Scanner")');
    await stopButton.trigger('click');

    expect(wrapper.vm.isScanning).toBe(false);
  });

  it('should play success sound when QR code is detected', async () => {
    const wrapper = mount(AttendanceScanner, {
      props: {
        serviceId: 1
      }
    });

    // Mock AudioContext
    const mockOscillator = {
      connect: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
      start: vi.fn(),
      stop: vi.fn()
    };

    const mockGainNode = {
      connect: vi.fn(),
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }
    };

    const mockAudioContext = {
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGainNode),
      currentTime: 0
    };

    global.AudioContext = vi.fn(() => mockAudioContext) as any;
    global.webkitAudioContext = vi.fn(() => mockAudioContext) as any;

    wrapper.vm.playSuccessSound();

    expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    expect(mockOscillator.start).toHaveBeenCalled();
  });
});
