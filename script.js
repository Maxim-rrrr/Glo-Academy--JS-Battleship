//span's отвечающие за значения:
const record = document.getElementById('record'); //Рекорд
const shot = document.getElementById('shot');     //Кол-во выстрел
const hit = document.getElementById('hit');       //Кол-во выстрел
const dead = document.getElementById('dead');     //Кол-во потоплений

const header = document.querySelector('.header'); //Заголовок 

//Таблица являющаяся игровым полем
const enemy = document.getElementById('enemy');

//Кнопка 'Начать заново'
const again = document.getElementById('again');

//
const game = {
  ships: [
    {
      location: ['26', '36', '46', '56'],   //Месторасположение коробля
      hit: ['', '', '', '']                 //Потбитые ячейки 
    },
    {
      location: ['11', '12', '13'],         //Месторасположение коробля
      hit: ['', '', '']                     //Потбитые ячейки 
    },
    {
      location: ['69', '79'],               //Месторасположение коробля
      hit: ['', '']                         //Потбитые ячейки 
    },
    {
      location: ['32'],                     //Месторасположение коробля
      hit: ['']                             //Потбитые ячейки 
    }
  ],
  
  shipCount: 4,                             //кол-во кораблей   
};

//Объект со всеми игровыми значениями
const play = {
  record: localStorage.getItem('seaBattleRecord') || 0,
  shot: 0,
  hit: 0,
  dead: 0,

  set updateData(data){
    this[data] += 1;
    this.render();
  },
  //Функция отображения значений
  render() {
    record.textContent = this.record;
    shot.textContent = this.shot;
    hit.textContent = this.hit;
    dead.textContent = this.dead;
  }
};

//Объект с функциями отображения игровых событий
const show = {
  //Функция попадания
  hit(elem) {
    this.changeClass(elem, 'hit');
  },
  
  //Функция промаха
  miss(elem) {
    this.changeClass(elem, 'miss');
  },

  //Функция потопления
  dead(elem) {
    this.changeClass(elem, 'dead');
  },

  //Функция смены класса 
  changeClass(elem, value) {
    elem.className = value;
  },
}


const fire = (event) => {
  /*
  Проверяем если у нашей клетки какой либо класс, если его нет, то на неё ещё не нажимали
  и мы должны исполнить функции добавления класса клетки и прибавить 1 к счётчику выстрелов
  */
  const target = event.target;
  
  //Прекращает выполнение функции fire если:
  //-- на клетку уже нажимали
  //-- нажатие было не по клетке
  //-- кораблей не осталось
  if (target.classList.length !== 0 || 
      target.tagName !== 'TD' || 
      !game.shipCount) return; 
  
  show.miss(target);
  play.updateData = 'shot';

  //Проверяем если в нажатой клетки корабль
  for (let i = 0; i < game.ships.length; i++) {
    const ship = game.ships[i];
    const index = ship.location.indexOf(target.id);

    if (index >= 0) {
      //Если есть то:
      show.hit(target);         //Меняем класс клетки на 'hit' - попадание 
      play.updateData = 'hit';  //Увеличиваем на 1 значение счётчика попаданий 
      ship.hit[index] = 'x';    //Отмечаем потбитые ячейки корабля 

      const life = ship.hit.indexOf('');
      if (life < 0) {
        play.updateData = 'dead';
        for (const id of ship.location) {
          show.dead(document.getElementById(id))
        }

        game.shipCount -= 1;

        if (!game.shipCount) {
          header.textContent = 'Игра окончена!';

          if (play.shot < play.record || play.record === 0) {
            localStorage.setItem('seaBattleRecord', play.shot)
            play.record = play.shot;
            play.render();
          }
 
        }

      }
    }
  }

};

//Основная функция игры
const init = () => {
  enemy.addEventListener('click', fire);        //Отслеживание нажатия на поле игры 
  play.render(); 

  again.addEventListener('click', () => {
    gameCompletionIndicator = false;
    location.reload();
  });
};

init()