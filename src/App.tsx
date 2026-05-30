import { useScene } from './hooks/useScene';
import { PreloaderScene } from './components/scenes/PreloaderScene';
import { NameInputScene } from './components/scenes/NameInputScene';
import { GreetingScene } from './components/scenes/GreetingScene';
import { LetterScene } from './components/scenes/LetterScene';
import { PauseScene } from './components/scenes/PauseScene';
import { ProposalScene } from './components/scenes/ProposalScene';
import { CelebrationScene } from './components/scenes/CelebrationScene';
import { HeartbreakScene } from './components/scenes/HeartbreakScene';
import { EndingScene } from './components/scenes/EndingScene';

function App() {
  const {
    currentScene,
    isTransitioning,
    sceneData,
    goToScene,
    setHerName,
    incrementNoAttempts,
  } = useScene();

  const sceneComponents = {
    preloader: (
      <PreloaderScene
        onComplete={() => goToScene('name-input')}
      />
    ),
    'name-input': (
      <NameInputScene
        onComplete={(name) => {
          setHerName(name);
          goToScene('greeting');
        }}
      />
    ),
    greeting: (
      <GreetingScene
        herName={sceneData.herName}
        onComplete={() => goToScene('letter')}
      />
    ),
    letter: (
      <LetterScene
        herName={sceneData.herName}
        onComplete={() => goToScene('pause')}
      />
    ),
    pause: (
      <PauseScene
        onComplete={() => goToScene('proposal')}
      />
    ),
    proposal: (
      <ProposalScene
        herName={sceneData.herName}
        noAttempts={sceneData.noAttempts}
        onYes={() => goToScene('celebration')}
        onNo={() => goToScene('heartbreak')}
        onNoAttempt={incrementNoAttempts}
      />
    ),
    celebration: (
      <CelebrationScene
        herName={sceneData.herName}
        onComplete={() => goToScene('ending')}
      />
    ),
    heartbreak: (
      <HeartbreakScene
        onComplete={() => goToScene('ending')}
      />
    ),
    ending: <EndingScene />,
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0a0e1a]">
      {/* Scene transition overlay */}
      <div
        className={`
          fixed inset-0 bg-[#0a0e1a] pointer-events-none z-50
          transition-opacity duration-500
          ${isTransitioning ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Current scene */}
      <div
        className={`
          w-full h-full
          transition-all duration-700 ease-out
          ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        `}
      >
        {sceneComponents[currentScene]}
      </div>
    </div>
  );
}

export default App;
