
        // Данные упражнений
        const exercises = [
            {
                id: 1,
                title: "Многозначные числа. Разряды.",
                icon: "fas fa-plus-minus",
                description: "Перетаскивай цифры в нужные поля по разрядам.",
                level: "3-4 класс",
                duration: "5-7 мин",
                url: "content/peretaskivanieMnogoznachnie/index.html"
            },
            {
                id: 2,
                title: "Напряжённый квест!",
                icon: "fas fa-times-divide",
                description: "Освойте таблицу умножения. Игровой формат.",
                level: "2-3 класс",
                duration: "3-5 мин",
                url: "content/FisikaDeepSeek/testFizika.html"
            },
            {
                id: 3,
                title: "Периметр и площадь",
                icon: "fas fa-shapes",
                description: "Практические задания с виртуальными инструментами.",
                level: "2-3 класс",
                duration: "5-7 мин",
                url: "content/PerimetrPloschadInteractiv/PerimetrPloschad.html"
            },
            {
                id: 4,
                title: "Математическая викторина.",
                icon: "fas fa-puzzle-piece",
                description: "Нумерация многозначных чисел. Интерактивное задание.",
                level: "2-4 класс",
                duration: "15-25 мин",
                url: "content/ViktorinaMatematika4klassMngznchChisla/index.html"
            },
            {
                id: 5,
                title: "Дроби",
                icon: "fas fa-pie-chart",
                description: "Познакомьтесь с дробями и их визуальным представлением. Интерактивные примеры и задачи.",
                level: "3-4 класс",
                duration: "20-30 мин",
                url: "https://example.com/math/exercise5.html"
            },
            {
                id: 6,
                title: "Измерения",
                icon: "fas fa-ruler-combined",
                description: "Учитесь измерять длину, вес и объем. Практические задания с виртуальными инструментами.",
                level: "2-4 класс",
                duration: "15-20 мин",
                url: "https://example.com/math/exercise6.html"
            }
        ];

        // Генерация карточек упражнений
        const exercisesGrid = document.getElementById('exercisesGrid');
        
        exercises.forEach(exercise => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.innerHTML = `
                <div class="exercise-header">
                    <div class="exercise-icon">
                        <i class="${exercise.icon}"></i>
                    </div>
                    <div class="exercise-title">${exercise.title}</div>
                </div>
                <div class="exercise-content">
                    <p class="exercise-description">${exercise.description}</p>
                    <div class="exercise-details">
                        <span><i class="fas fa-graduation-cap"></i> ${exercise.level}</span>
                        <span><i class="fas fa-clock"></i> ${exercise.duration}</span>
                    </div>
                    <button class="exercise-btn" data-id="${exercise.id}">
                        Начать упражнение <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            exercisesGrid.appendChild(card);
        });

        // Элементы DOM
        const exerciseContainer = document.getElementById('exerciseContainer');
        const exercisesGridContainer = document.getElementById('exercisesGrid');
        const exerciseFrame = document.getElementById('exerciseFrame');
        const currentExerciseName = document.getElementById('currentExerciseName');
        const backBtn = document.getElementById('backBtn');
        const mainBackBtn = document.getElementById('mainBackBtn');
        const sizeDownBtn = document.getElementById('sizeDownBtn');
        const sizeUpBtn = document.getElementById('sizeUpBtn');
        const sizeResetBtn = document.getElementById('sizeResetBtn');

        // Обработчики событий для кнопок упражнений
        document.querySelectorAll('.exercise-btn').forEach(button => {
            button.addEventListener('click', function() {
                const exerciseId = parseInt(this.getAttribute('data-id'));
                const exercise = exercises.find(e => e.id === exerciseId);
                
                if (exercise) {
                    // Показываем контейнер с упражнением
                    exercisesGridContainer.style.display = 'none';
                    exerciseContainer.style.display = 'flex';
                    
                    // Устанавливаем заголовок и загружаем iframe
                    currentExerciseName.textContent = exercise.title;
                    exerciseFrame.src = exercise.url;
                    
                    // Сброс размера iframe
                    exerciseFrame.style.height = '500px';
                }
            });
        });

        // Кнопка "Вернуться к списку упражнений"
        backBtn.addEventListener('click', function() {
            exerciseContainer.style.display = 'none';
            exercisesGridContainer.style.display = 'grid';
            exerciseFrame.src = 'about:blank';
        });

        // Кнопка "Вернуться на лендинг"
        mainBackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // alert('Возврат на лендинг онлайн-репетитора');
            window.location.href = 'index.html';
        });

        // Управление размером iframe
        sizeDownBtn.addEventListener('click', function() {
            const currentHeight = parseInt(exerciseFrame.style.height || '500');
            if (currentHeight > 300) {
                exerciseFrame.style.height = (currentHeight - 50) + 'px';
            }
        });

        sizeUpBtn.addEventListener('click', function() {
            const currentHeight = parseInt(exerciseFrame.style.height || '500');
            if (currentHeight < 800) {
                exerciseFrame.style.height = (currentHeight + 50) + 'px';
            }
        });

        sizeResetBtn.addEventListener('click', function() {
            exerciseFrame.style.height = '500px';
        });

        // Имитация возврата на лендинг из интерактивов
        window.addEventListener('message', function(event) {
            if (event.data === 'backToMain') {
                exerciseContainer.style.display = 'none';
                exercisesGridContainer.style.display = 'grid';
                exerciseFrame.src = 'about:blank';
            }
        });
 