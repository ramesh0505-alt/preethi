import { useState, useCallback } from 'react';

export type SceneType =
  | 'preloader'
  | 'name-input'
  | 'greeting'
  | 'letter'
  | 'pause'
  | 'proposal'
  | 'celebration'
  | 'heartbreak'
  | 'ending';

export interface SceneState {
  currentScene: SceneType;
  previousScene: SceneType | null;
  isTransitioning: boolean;
  sceneData: {
    herName: string;
    noAttempts: number;
    startTime: number;
  };
}

export function useScene() {
  const [state, setState] = useState<SceneState>({
    currentScene: 'preloader',
    previousScene: null,
    isTransitioning: false,
    sceneData: {
      herName: '',
      noAttempts: 0,
      startTime: Date.now(),
    },
  });

  const goToScene = useCallback((scene: SceneType, delay: number = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentScene: scene,
          previousScene: prev.currentScene,
          isTransitioning: true,
        }));
        setTimeout(() => {
          setState(prev => ({ ...prev, isTransitioning: false }));
        }, 800);
      }, delay);
    } else {
      setState(prev => ({
        ...prev,
        currentScene: scene,
        previousScene: prev.currentScene,
        isTransitioning: true,
      }));
      setTimeout(() => {
        setState(prev => ({ ...prev, isTransitioning: false }));
      }, 800);
    }
  }, []);

  const setHerName = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      sceneData: { ...prev.sceneData, herName: name },
    }));
  }, []);

  const incrementNoAttempts = useCallback(() => {
    setState(prev => ({
      ...prev,
      sceneData: {
        ...prev.sceneData,
        noAttempts: prev.sceneData.noAttempts + 1,
      },
    }));
  }, []);

  return {
    ...state,
    goToScene,
    setHerName,
    incrementNoAttempts,
  };
}
