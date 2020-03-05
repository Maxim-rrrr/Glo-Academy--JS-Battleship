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


const fire = (event) => {
  /*
  Проверяем если у нашей клетки какой либо класс, если его нет, то на неё ещё не нажимали
  и мы должны исполнить функции добавления класса клетки и прибавить 1 к счётчику выстрелов
  */
  const target = event.target;
  if (target.classList.length !== 0 || target.tagName !== 'TD') return;

  show.miss(target);
  play.updateData = 'shot';

};

//Основная функция игры
const init = () => {
  enemy.addEventListener('click', fire);        //Отслеживание нажатия на поле игры  
};

init()