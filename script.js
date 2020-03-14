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

//Функция генерации кораблей
const game = {
  ships: [],  
  shipCount: 0, //кол-во кораблей 
  optionShip: {
    count:  [1, 2, 3, 4],  //кол-во кораблей определённого размера
    size:   [4, 3, 2, 1]   //размеры кораблей
  },

  //Сеттер со всёми клетками безопасной зоны
  collision: new Set(),

  //Функция генирации кораблей
  generateShip() {
    for (let i = 0; i < this.optionShip.count.length; i++) {
      for (let j = 0; j < this.optionShip.count[i]; j++) {
        const size = this.optionShip.size[i];
        const ship = this.generateOptionShip(size);
        this.ships.push(ship);
        this.shipCount++;
      }
    }
  },

  //Создание кораблей и расчёт безопасной зоны вокруг них
  generateOptionShip(shipSize){
    const ship = {
      hit: [],
      location: [],
    };

    const directon = Math.random() < 0.5;
    let x, y;

    if (directon) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * (10 - shipSize));
    } else {
      x = Math.floor(Math.random() * (10 - shipSize));
      y = Math.floor(Math.random() * 10);
    }

    for (let i = 0; i < shipSize; i++) {
      if (directon) {
        ship.location.push(x + '' + (y + i))
      } else {
        ship.location.push((x + i) + '' + y)
      }
      ship.hit.push('');
    }

    if (this.checkCollision(ship.location)){
      return this.generateOptionShip(shipSize)
    }

    this.addCollision(ship.location);

    return ship;
  },

  //функция отдающая true если корабль не попадает не в одну из клеток безопасной зоны
  checkCollision(location) {
    for (const coord of location){
      if  (this.collision.has(coord)){
        return true;
      }

    }

  },

  //функция добавления безопасной зоны в общий сеттер
  addCollision(location){
    for (let i = 0; i < location.length; i++) {
      const startCoordX = location[i][0] - 1;

      for (let j = startCoordX; j < startCoordX + 3; j++) {
        const startCoordY = location[i][1] - 1;

        for (let z = startCoordY; z < startCoordY + 3; z++) {
          if (j >= 0 && j < 10 && z >= 0 && z < 10) {
            const coord = j + '' + z;
            
            this.collision.add(coord);

          }

        }

      }

    }

  },

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

//Функция выстрела
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

  game.generateShip();

  again.addEventListener('click', () => {
    gameCompletionIndicator = false;
    location.reload();
  });
  record.addEventListener('dblclick', () => {
    localStorage.clear();
    play.record = 0;
    play.render();
  });
};

init()