import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Chapter = {
  id: number;
  title: string;
  location: string;
  character: string;
  gradient: string;
  description: string;
  dialogue: string[];
  completed: boolean;
};

const Index = () => {
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const chapters: Chapter[] = [
    {
      id: 1,
      title: 'Глава 1: Таф',
      location: 'Лес Roblox',
      character: 'Taph из Forsaken',
      gradient: 'from-purple-900 via-purple-700 to-pink-500',
      description: 'Silent Salt встречает Тафа, который пытается научить его говорить через эмодзи.',
      dialogue: [
        '👋',
        '🫵',
        '🗿',
        '🤷',
        'Silent Salt ничего не понял и идёт дальше...'
      ],
      completed: false
    },
    {
      id: 2,
      title: 'Глава 2: Джейсон',
      location: 'Тёмный лес',
      character: 'Jason Voorhees',
      gradient: 'from-gray-900 via-red-900 to-black',
      description: 'В глубине леса Silent Salt находит Джейсона Вурхиза.',
      dialogue: [
        'Ki... ki...',
        'Ma... ma...',
        'Ki ki ma...',
        'Silent Salt снова ничего не понял...'
      ],
      completed: false
    },
    {
      id: 3,
      title: 'Глава 3: Гастер',
      location: 'Чёрный мир',
      character: 'Gaster из Undertale',
      gradient: 'from-black via-gray-900 to-black',
      description: 'Silent Salt падает в яму и оказывается в полностью чёрном мире.',
      dialogue: [
        '✋︎ ⧫︎♒︎♓︎■︎🙵 ⍓︎□︎◆︎🕯︎❒︎♏︎ ♋︎',
        '●︎♓︎⧫︎⧫︎●︎♏︎ □︎◆︎⧫︎ □︎♐︎ ⧫︎□︎◆︎♍︎♒︎',
        '⬥︎♓︎⧫︎♒︎ ❒︎♏︎♋︎●︎♓︎⧫︎⍓︎📪︎ ♌︎◆︎♎︎♎︎⍓︎📬︎',
        'Гастер отправляет Silent Salt обратно...'
      ],
      completed: false
    },
    {
      id: 4,
      title: 'Глава 4: Нокс',
      location: 'Cookie Run Kingdom',
      character: 'Конь Нокс',
      gradient: 'from-purple-400 via-pink-300 to-cookie-pink',
      description: 'Silent Salt возвращается домой и находит своего коня Нокс.',
      dialogue: [
        'Привет, мой друг.',
        'Я вижу, ты искал того, кто научит тебя говорить.',
        'Ты прошёл долгий путь...',
        'Теперь послушай меня внимательно...',
        'Повторяй за мной: "При-вет"',
        'Silent Salt: "При... вет..."',
        '🎉 Silent Salt научился говорить!'
      ],
      completed: false
    }
  ];

  const [chapterList, setChapterList] = useState(chapters);

  const startGame = () => {
    setGameStarted(true);
  };

  const startChapter = (chapterId: number) => {
    setCurrentChapter(chapterId);
    setDialogueIndex(0);
  };

  const nextDialogue = () => {
    const chapter = chapterList.find(c => c.id === currentChapter);
    if (chapter && dialogueIndex < chapter.dialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      completeChapter();
    }
  };

  const completeChapter = () => {
    setChapterList(prev =>
      prev.map(c =>
        c.id === currentChapter ? { ...c, completed: true } : c
      )
    );
    setCurrentChapter(null);
    setDialogueIndex(0);
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
            <h1 className="font-caveat text-6xl md:text-7xl text-cookie-pink stroke-deep-black">
              Silent Salt's Journey
            </h1>
            <p className="text-white text-xl font-montserrat">
              Отправляйся в путешествие с Silent Salt, который ищет того, кто научит его говорить
            </p>
            <Button 
              onClick={startGame}
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

  if (currentChapter !== null) {
    const chapter = chapterList.find(c => c.id === currentChapter);
    if (!chapter) return null;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${chapter.gradient} flex items-center justify-center p-4`}>
        <Card className="max-w-3xl w-full bg-black/40 backdrop-blur-lg border-white/20 p-6 md:p-10 animate-slide-in">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-caveat text-5xl text-cookie-pink mb-2">
                {chapter.title}
              </h2>
              <p className="text-white/80 font-montserrat text-lg">
                {chapter.location}
              </p>
            </div>

            <div className="bg-white/10 rounded-3xl p-8 min-h-[200px] flex items-center justify-center">
              <p className="text-white text-3xl md:text-4xl font-caveat text-center animate-fade-in">
                {chapter.dialogue[dialogueIndex]}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-white/60 font-montserrat text-sm">
                {dialogueIndex + 1} / {chapter.dialogue.length}
              </div>
              <Button
                onClick={nextDialogue}
                className="bg-white text-deep-black hover:bg-white/90 rounded-full px-6 py-3"
              >
                {dialogueIndex < chapter.dialogue.length - 1 ? 'Далее' : 'Завершить'}
                <Icon name="ChevronRight" className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-magic via-purple-900 to-deep-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-caveat text-6xl text-cookie-pink mb-4">
            Silent Salt's Journey
          </h1>
          <p className="text-white font-montserrat text-xl">
            Выбери главу для продолжения истории
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapterList.map((chapter, index) => (
            <Card
              key={chapter.id}
              className={`bg-gradient-to-br ${chapter.gradient} border-white/20 p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                chapter.completed ? 'opacity-60' : ''
              } ${index > 0 && !chapterList[index - 1].completed ? 'opacity-40 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (index === 0 || chapterList[index - 1].completed) {
                  startChapter(chapter.id);
                }
              }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-caveat text-3xl text-white mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-white/80 font-montserrat text-sm mb-1">
                      📍 {chapter.location}
                    </p>
                    <p className="text-white/70 font-montserrat text-sm">
                      🎭 {chapter.character}
                    </p>
                  </div>
                  {chapter.completed && (
                    <div className="bg-green-500 rounded-full p-2">
                      <Icon name="Check" size={20} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-white/90 font-montserrat text-sm">
                  {chapter.description}
                </p>
                {index > 0 && !chapterList[index - 1].completed && (
                  <div className="flex items-center gap-2 text-white/50 text-sm">
                    <Icon name="Lock" size={16} />
                    <span>Доступно после прохождения предыдущей главы</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
