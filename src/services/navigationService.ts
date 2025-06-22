
interface NavigationStep {
  instruction: string;
  distance: number;
  duration: number;
  type: 'turn-left' | 'turn-right' | 'straight' | 'roundabout' | 'destination';
  coordinate: [number, number];
}

interface NavigationSession {
  steps: NavigationStep[];
  currentStepIndex: number;
  totalDistance: number;
  totalDuration: number;
  isActive: boolean;
}

export class NavigationService {
  private static currentSession: NavigationSession | null = null;
  private static speechSynthesis: SpeechSynthesis | null = null;
  private static voiceEnabled: boolean = true;

  static initializeSpeech() {
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  static createNavigationSteps(route: { coordinates: [number, number][]; distance: number; duration: number }): NavigationStep[] {
    const steps: NavigationStep[] = [];
    const coords = route.coordinates;
    
    if (coords.length < 2) return steps;

    // Create simplified navigation steps
    for (let i = 0; i < coords.length - 1; i++) {
      const current = coords[i];
      const next = coords[i + 1];
      const isLast = i === coords.length - 2;
      
      let instruction = '';
      let type: NavigationStep['type'] = 'straight';
      
      if (i === 0) {
        instruction = 'Head towards your destination';
        type = 'straight';
      } else if (isLast) {
        instruction = 'You have reached your destination';
        type = 'destination';
      } else {
        // Simple direction logic based on coordinate changes
        const bearing = this.calculateBearing(current, next);
        const prevBearing = this.calculateBearing(coords[i - 1], current);
        const turnAngle = bearing - prevBearing;
        
        if (Math.abs(turnAngle) < 30) {
          instruction = 'Continue straight';
          type = 'straight';
        } else if (turnAngle > 0) {
          instruction = 'Turn right';
          type = 'turn-right';
        } else {
          instruction = 'Turn left';
          type = 'turn-left';
        }
      }
      
      const distance = this.calculateDistance(current, next) * 1000; // Convert to meters
      const duration = distance / 15; // Approximate 15 m/s speed
      
      steps.push({
        instruction,
        distance,
        duration,
        type,
        coordinate: next
      });
    }
    
    return steps;
  }

  static startNavigation(route: { coordinates: [number, number][]; distance: number; duration: number }) {
    const steps = this.createNavigationSteps(route);
    
    this.currentSession = {
      steps,
      currentStepIndex: 0,
      totalDistance: route.distance,
      totalDuration: route.duration,
      isActive: true
    };
    
    // Announce first instruction
    if (steps.length > 0) {
      this.announceInstruction(steps[0].instruction);
    }
    
    // Store in localStorage for offline persistence
    localStorage.setItem('ecomap-navigation-session', JSON.stringify(this.currentSession));
    
    return this.currentSession;
  }

  static updatePosition(currentPosition: [number, number]): { 
    currentStep: NavigationStep | null; 
    nextStep: NavigationStep | null; 
    distanceToNext: number;
    shouldAdvance: boolean;
  } {
    if (!this.currentSession || !this.currentSession.isActive) {
      return { currentStep: null, nextStep: null, distanceToNext: 0, shouldAdvance: false };
    }

    const { steps, currentStepIndex } = this.currentSession;
    const currentStep = steps[currentStepIndex];
    const nextStep = steps[currentStepIndex + 1] || null;
    
    if (!currentStep) {
      return { currentStep: null, nextStep: null, distanceToNext: 0, shouldAdvance: false };
    }

    const distanceToNext = this.calculateDistance(currentPosition, currentStep.coordinate) * 1000;
    const shouldAdvance = distanceToNext < 50; // 50 meters threshold
    
    if (shouldAdvance && nextStep) {
      this.currentSession.currentStepIndex++;
      this.announceInstruction(nextStep.instruction);
      localStorage.setItem('ecomap-navigation-session', JSON.stringify(this.currentSession));
    }
    
    return { currentStep, nextStep, distanceToNext, shouldAdvance };
  }

  static announceInstruction(instruction: string) {
    if (!this.voiceEnabled || !this.speechSynthesis) return;
    
    this.speechSynthesis.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(instruction);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    this.speechSynthesis.speak(utterance);
  }

  static stopNavigation() {
    if (this.currentSession) {
      this.currentSession.isActive = false;
    }
    this.currentSession = null;
    localStorage.removeItem('ecomap-navigation-session');
    
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  static toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    return this.voiceEnabled;
  }

  static getCurrentSession(): NavigationSession | null {
    if (!this.currentSession) {
      // Try to restore from localStorage
      const stored = localStorage.getItem('ecomap-navigation-session');
      if (stored) {
        try {
          this.currentSession = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to restore navigation session:', e);
        }
      }
    }
    return this.currentSession;
  }

  private static calculateBearing(start: [number, number], end: [number, number]): number {
    const startLat = this.deg2rad(start[0]);
    const startLng = this.deg2rad(start[1]);
    const endLat = this.deg2rad(end[0]);
    const endLng = this.deg2rad(end[1]);
    
    const dLng = endLng - startLng;
    
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    
    const bearing = Math.atan2(y, x);
    return (this.rad2deg(bearing) + 360) % 360;
  }

  private static calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(coord2[0] - coord1[0]);
    const dLon = this.deg2rad(coord2[1] - coord1[1]);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(coord1[0])) * Math.cos(this.deg2rad(coord2[0])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private static rad2deg(rad: number): number {
    return rad * (180/Math.PI);
  }
}
