import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Joystick from '@/components/Joystick';

type Character = {
  id: string;
  name: string;
  emoji: string;
  position: number;
  dialogue: string[];
  met: boolean;
};

type Level = {
  id: number;
  name: string;
  gradient: string;
  backgroundImage?: string;
  characters: Character[];
  width: number;
};

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [activeDialogue, setActiveDialogue] = useState<Character | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [keys, setKeys] = useState({ left: false, right: false });
  const [joystickDirection, setJoystickDirection] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const levels: Level[] = [
    {
      id: 0,
      name: 'Жуткий Отель - Forsaken',
      gradient: 'from-purple-900 via-purple-700 to-pink-500',
      backgroundImage: 'https://cdn.poehali.dev/files/5c0be242-eb6d-4b22-9784-f34b3f3cd67d.png',
      width: 2000,
      characters: [
        {
          id: 'taph',
          name: 'Taph',
          emoji: '🗿',
          position: 800,
          dialogue: ['👋', '🫵', '🗿', '🤷', 'Silent Salt ничего не понял...'],
          met: false
        }
      ]
    },
    {
      id: 1,
      name: 'Тёмный лес',
      gradient: 'from-gray-900 via-red-900 to-black',
      width: 2000,
      characters: [
        {
          id: 'jason',
          name: 'Jason Voorhees',
          emoji: '🔪',
          position: 900,
          dialogue: ['Ki... ki...', 'Ma... ma...', 'Ki ki ma...', 'Silent Salt снова не понял...'],
          met: false
        }
      ]
    },
    {
      id: 2,
      name: 'Чёрный мир',
      gradient: 'from-black via-gray-900 to-black',
      width: 2000,
      characters: [
        {
          id: 'gaster',
          name: 'W.D. Gaster',
          emoji: '👤',
          position: 1000,
          dialogue: [
            '✋︎ ⧫︎♒︎♓︎■︎🙵 ⍓︎□︎◆︎🕯︎❒︎♏︎ ♋︎',
            '●︎♓︎⧫︎⧫︎●︎♏︎ □︎◆︎⧫︎ □︎♐︎ ⧫︎□︎◆︎♍︎♒︎',
            '⬥︎♓︎⧫︎♒︎ ❒︎♏︎♋︎●︎♓︎⧫︎⍓︎📪︎ ♌︎◆︎♎︎♎︎⍓︎📬︎',
            'Гастер отправляет тебя домой...'
          ],
          met: false
        }
      ]
    },
    {
      id: 3,
      name: 'Cookie Run Kingdom',
      gradient: 'from-purple-400 via-pink-300 to-cookie-pink',
      width: 2000,
      characters: [
        {
          id: 'nox',
          name: 'Конь Нокс',
          emoji: '🐴',
          position: 1100,
          dialogue: [
            'Привет, мой друг.',
            'Я вижу, ты искал того, кто научит тебя говорить.',
            'Ты прошёл долгий путь...',
            'Повторяй за мной: "При-вет"',
            'Silent Salt: "При... вет..."',
            '🎉 Ты научился говорить!'
          ],
          met: false
        }
      ]
    }
  ];

  const [levelsState, setLevelsState] = useState(levels);

  const checkNearbyCharacters = useCallback(() => {
    const level = levelsState[currentLevel];
    const nearbyChar = level.characters.find(char => 
      Math.abs(char.position - playerPosition) < 100
    );
    
    if (nearbyChar && !nearbyChar.met) {
      setActiveDialogue(nearbyChar);
      setDialogueIndex(0);
    }
  }, [levelsState, currentLevel, playerPosition]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (activeDialogue) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      setKeys(prev => ({ ...prev, left: true }));
      setDirection('left');
      setIsMoving(true);
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      setKeys(prev => ({ ...prev, right: true }));
      setDirection('right');
      setIsMoving(true);
    }
    if (e.key === ' ' || e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      checkNearbyCharacters();
    }
  }, [activeDialogue, checkNearbyCharacters]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      setKeys(prev => ({ ...prev, left: false }));
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      setKeys(prev => ({ ...prev, right: false }));
    }
  }, []);

  useEffect(() => {
    if (!gameStarted) return;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const hasMovement = keys.left || keys.right || joystickDirection.x !== 0;
    setIsMoving(hasMovement);
    
    if (!hasMovement) return;

    const interval = setInterval(() => {
      setPlayerPosition(prev => {
        const speed = 5;
        const maxWidth = levelsState[currentLevel].width;
        
        let movement = 0;
        if (keys.left) movement = -speed;
        if (keys.right) movement = speed;
        if (joystickDirection.x !== 0) movement = joystickDirection.x * speed;
        
        if (movement < 0) {
          setDirection('left');
          return Math.max(50, prev + movement);
        }
        if (movement > 0) {
          setDirection('right');
          const newPos = prev + movement;
          if (newPos >= maxWidth - 50) {
            if (currentLevel < levelsState.length - 1) {
              setCurrentLevel(currentLevel + 1);
              return 50;
            }
            return maxWidth - 50;
          }
          return newPos;
        }
        return prev;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [keys, joystickDirection, currentLevel, levelsState]);

  const nextDialogue = () => {
    if (!activeDialogue) return;
    
    if (dialogueIndex < activeDialogue.dialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setLevelsState(prev => prev.map(level => ({
        ...level,
        characters: level.characters.map(char =>
          char.id === activeDialogue.id ? { ...char, met: true } : char
        )
      })));
      setActiveDialogue(null);
      setDialogueIndex(0);
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-magic via-purple-900 to-deep-black flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-cookie-white/10 backdrop-blur-lg border-cookie-pink/30 p-8 md:p-12 animate-fade-in">
          <div className="text-center space-y-6">
            <div className="animate-float">
              <img 
                src="https://cdn.poehali.dev/files/e5ee1c7e-8e80-4fdf-ba85-d81ddec424dd.png" 
                alt="Silent Salt" 
                className="w-48 h-48 mx-auto object-contain"
              />
            </div>
            <h1 className="font-caveat text-6xl md:text-7xl text-cookie-pink">
              Silent Salt's Journey
            </h1>
            <p className="text-white text-xl font-montserrat">
              Путешествуй по локациям, встречай персонажей и учись говорить
            </p>
            <div className="bg-white/10 rounded-2xl p-4 text-left space-y-2 text-white/80">
              <p className="font-montserrat text-sm">⌨️ Управление:</p>
              <p className="font-montserrat text-sm md:block hidden">← → или A/D - движение</p>
              <p className="font-montserrat text-sm md:block hidden">Пробел или E - общаться</p>
              <p className="font-montserrat text-sm md:hidden">Джойстик слева - движение</p>
              <p className="font-montserrat text-sm md:hidden">Кнопка E справа - общаться</p>
            </div>
            <Button 
              onClick={() => setGameStarted(true)}
              size="lg"
              className="bg-cookie-pink hover:bg-cookie-pink/90 text-white text-xl px-8 py-6 rounded-full shadow-lg hover:shadow-cookie-pink/50 transition-all duration-300 hover:scale-105"
            >
              Начать приключение
              <Icon name="Sparkles" className="ml-2" size={24} />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentLevelData = levelsState[currentLevel];
  const scrollOffset = Math.max(0, playerPosition - 400);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentLevelData.gradient} overflow-hidden relative`}>
      {currentLevelData.backgroundImage && (
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${currentLevelData.backgroundImage})`,
            filter: 'blur(2px)'
          }}
        />
      )}
      
      <div className="absolute top-4 left-4 z-20">
        <Card className="bg-black/50 backdrop-blur-lg border-white/20 p-4">
          <p className="text-white font-caveat text-2xl mb-2">{currentLevelData.name}</p>
          <div className="space-y-1 text-white/70 text-sm font-montserrat">
            {!isMobile && <p>← → / A D - движение</p>}
            {!isMobile && <p>Пробел / E - общаться</p>}
            {isMobile && <p>Джойстик - движение</p>}
            {isMobile && <p>Кнопка E - общаться</p>}
          </div>
        </Card>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <Card className="bg-black/50 backdrop-blur-lg border-white/20 p-4">
          <p className="text-white font-montserrat text-sm">
            Уровень {currentLevel + 1} / {levelsState.length}
          </p>
        </Card>
      </div>

      <div 
        className="relative h-screen transition-transform duration-75"
        style={{ 
          transform: `translateX(-${scrollOffset}px)`,
          width: `${currentLevelData.width}px`
        }}
      >
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div 
          className="absolute bottom-32 transition-all duration-75"
          style={{ 
            left: `${playerPosition}px`,
            transform: `scaleX(${direction === 'left' ? -1 : 1})`
          }}
        >
          <div className={`${isMoving ? 'animate-bounce' : ''}`}>
            <img 
              src="https://cdn.poehali.dev/files/e5ee1c7e-8e80-4fdf-ba85-d81ddec424dd.png" 
              alt="Silent Salt" 
              className="w-32 h-32 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {currentLevelData.characters.map(char => {
          const distance = Math.abs(char.position - playerPosition);
          const isNearby = distance < 100;
          
          return (
            <div
              key={char.id}
              className="absolute bottom-32"
              style={{ left: `${char.position}px` }}
            >
              <div className="relative">
                <div className={`text-8xl transition-all duration-300 ${char.met ? 'opacity-50' : ''}`}>
                  {char.emoji}
                </div>
                {isNearby && !activeDialogue && !char.met && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="bg-white text-black px-4 py-2 rounded-full font-montserrat text-sm whitespace-nowrap shadow-lg">
                      Нажми E или Пробел
                    </div>
                  </div>
                )}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <p className="text-white font-caveat text-2xl drop-shadow-lg">
                    {char.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeDialogue && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-fade-in">
          <Card className="max-w-2xl w-full bg-gradient-to-br from-purple-900/90 to-black/90 backdrop-blur-lg border-cookie-pink/50 p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{activeDialogue.emoji}</div>
                <div>
                  <h3 className="font-caveat text-4xl text-cookie-pink">
                    {activeDialogue.name}
                  </h3>
                  <p className="text-white/70 font-montserrat text-sm">
                    пытается научить тебя говорить
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-3xl p-8 min-h-[150px] flex items-center justify-center">
                <p className="text-white text-4xl font-caveat text-center">
                  {activeDialogue.dialogue[dialogueIndex]}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-white/60 font-montserrat text-sm">
                  {dialogueIndex + 1} / {activeDialogue.dialogue.length}
                </div>
                <Button
                  onClick={nextDialogue}
                  className="bg-cookie-pink hover:bg-cookie-pink/90 text-white rounded-full px-6 py-3"
                >
                  {dialogueIndex < activeDialogue.dialogue.length - 1 ? 'Далее' : 'Закрыть'}
                  <Icon name="ChevronRight" className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {currentLevel === levelsState.length - 1 && 
       levelsState[currentLevel].characters.every(char => char.met) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4 animate-fade-in">
          <Card className="max-w-xl w-full bg-gradient-to-br from-cookie-pink to-purple-magic p-12 text-center">
            <div className="space-y-6">
              <div className="text-8xl animate-bounce">🎉</div>
              <h2 className="font-caveat text-6xl text-white">
                Поздравляю!
              </h2>
              <p className="text-white text-2xl font-montserrat">
                Silent Salt научился говорить благодаря твоей помощи!
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-white text-purple-900 hover:bg-white/90 text-xl px-8 py-4 rounded-full"
              >
                Играть заново
              </Button>
            </div>
          </Card>
        </div>
      )}

      {isMobile && (
        <Joystick 
          onMove={(dir) => setJoystickDirection(dir)}
          onAction={checkNearbyCharacters}
        />
      )}
    </div>
  );
};

export default Index;