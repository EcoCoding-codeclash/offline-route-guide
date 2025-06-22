
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NavigationService } from '../services/navigationService';

interface NavigationStep {
  instruction: string;
  distance: number;
  duration: number;
  type: 'turn-left' | 'turn-right' | 'straight' | 'roundabout' | 'destination';
  coordinate: [number, number];
}

interface NavigationContextType {
  isNavigating: boolean;
  currentStep: NavigationStep | null;
  nextStep: NavigationStep | null;
  distanceToNext: number;
  voiceEnabled: boolean;
  startNavigation: (route: { coordinates: [number, number][]; distance: number; duration: number }) => void;
  stopNavigation: () => void;
  toggleVoice: () => void;
  updatePosition: (position: [number, number]) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState<NavigationStep | null>(null);
  const [nextStep, setNextStep] = useState<NavigationStep | null>(null);
  const [distanceToNext, setDistanceToNext] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    // Initialize speech synthesis
    NavigationService.initializeSpeech();
    
    // Check for existing navigation session
    const session = NavigationService.getCurrentSession();
    if (session && session.isActive) {
      setIsNavigating(true);
      if (session.steps[session.currentStepIndex]) {
        setCurrentStep(session.steps[session.currentStepIndex]);
        setNextStep(session.steps[session.currentStepIndex + 1] || null);
      }
    }
  }, []);

  const startNavigation = (route: { coordinates: [number, number][]; distance: number; duration: number }) => {
    console.log('Starting navigation with route:', route);
    const session = NavigationService.startNavigation(route);
    
    if (session && session.steps.length > 0) {
      setIsNavigating(true);
      setCurrentStep(session.steps[0]);
      setNextStep(session.steps[1] || null);
      setDistanceToNext(0);
    }
  };

  const stopNavigation = () => {
    console.log('Stopping navigation');
    NavigationService.stopNavigation();
    setIsNavigating(false);
    setCurrentStep(null);
    setNextStep(null);
    setDistanceToNext(0);
  };

  const toggleVoice = () => {
    const newVoiceState = NavigationService.toggleVoice();
    setVoiceEnabled(newVoiceState);
  };

  const updatePosition = (position: [number, number]) => {
    if (!isNavigating) return;
    
    const result = NavigationService.updatePosition(position);
    setCurrentStep(result.currentStep);
    setNextStep(result.nextStep);
    setDistanceToNext(result.distanceToNext);
    
    // Check if navigation is complete
    if (result.currentStep?.type === 'destination') {
      setTimeout(() => {
        stopNavigation();
      }, 3000); // Stop navigation 3 seconds after reaching destination
    }
  };

  return (
    <NavigationContext.Provider value={{
      isNavigating,
      currentStep,
      nextStep,
      distanceToNext,
      voiceEnabled,
      startNavigation,
      stopNavigation,
      toggleVoice,
      updatePosition
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
