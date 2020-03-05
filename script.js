//span's отвечающие за значения:
const record = document.getElementById('record'); //Рекорд
const shot = document.getElementById('shot');     //Кол-во выстрел
const hit = document.getElementById('hit');       //Кол-во выстрел
const dead = document.getElementById('dead');     //Кол-во потоплений

//Таблица являющаяся игровым полем
const enemy = document.getElementById('enemy');

//Кнопка 'Начать заново'
const again = document.getElementById('again');

//Объект со всеми игровыми значениями
const play = {
  record: 0,
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
  hit() {

  },
  
  //Функция промаха
  miss(elem) {
    this.changeClass(elem, 'miss');
  },

  //Функция потопления
  dead() {

  },

  //Функция смены класса 
  changeClass(elem, value) {
    elem.className = value;
  },
}

//Функция выстрела
let i = 0;                                      //Счётчик следующего значения массива labeledCells
let labeledCells = [];                          //Массив с уже отмеченными клетками поля

const fire = (event) => {
  const target = event.target;
  
  /*
  Проверяем есть ли у нас в массиве с уже отмеченными клетками поля(labeledCells[]) 
  номер нажатой клетки и если её нет, то:
  --Вызываем функцию из объекта show для отображения помеченной клетки
  --Вызываем метод updateData объекта play с аргументом 'shot' для повышения на один переменной счётчика выстрелов

  --Добавляем клетку в помеченный labeledCells[]
  --Увеличиваем переменную i являющуюся счётчиком следующего индекса labeledCells[]
  */ 
  if (labeledCells.indexOf( target ) == -1 ) {  
    show.miss(target);
    play.updateData = 'shot';

    labeledCells[i] = target;
    i++;
  }
  
};

//Основная функция игры
const init = () => {
  enemy.addEventListener('click', fire);        //Отслеживание нажатия на поле игры  
};

init()