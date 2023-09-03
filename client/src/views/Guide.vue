<template>
  <div class="intro">
	<div>
	  <nav id="guideNavbar" class="navbar bg-body-tertiary mb-3" style="position: fixed; width: 100%; z-index:4; padding: 8px 48px 8px 62px;">
		<div class="d-flex justify-content-between">
		  <a href="#" class="navbar-brand d-none d-sm-none d-md-block">Инструкция: </a>
		  <ul class="nav nav-pills">
			<li>
			  <a href="#navigation" class="nav-link">Навигация</a>
			</li>
			<li class="nav-item dropdown">
			  <a href="#Editor" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Редактор</a>
			  <ul class="dropdown-menu">
				<li> <a href="#Editor" class="dropdown-item">Кто это</a></li>
				<li> <a href="#Editor1" class="dropdown-item">Интерфейс страницы редактора</a> </li>
				<li> <a href="#Editor21" class="dropdown-item">Шаблоны и работа с ними</a></li>
				<li> <a href="#Editor22" class="dropdown-item">Видимость шаблонов</a></li>
				<li> <a href="#Editor3" class="dropdown-item">Отправка программы трансляции</a></li>
				<li> <a href="#Editor4" class="dropdown-item">Важно</a></li>
			  </ul>
			</li>
			<li class="nav-item dropdown">
			  <a href="#Adsender" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Менеджер</a>
			  <ul class="dropdown-menu">
				<li> <a href="#Adsender" class="dropdown-item">Кто это</a></li>
				<li> <a href="#Adsender1" class="dropdown-item">Интерфейс страницы уведомлений</a> </li>
			  </ul>
			</li>
			<li class="nav-item dropdown">
			  <a href="#Moder" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Модератор</a>
			  <ul class="dropdown-menu">
				<li> <a href="#Moder" class="dropdown-item">Кто это</a></li>
				<li> <a href="#Moder1" class="dropdown-item">Запросы на модерацию</a> </li>
				<li> <a href="#Moder2" class="dropdown-item">Очередь отображения</a></li>
				<li> <a href="#Moder3" class="dropdown-item">Активное отображение</a></li>
				<li> <a href="#Moder4" class="dropdown-item">Обработка программы трансляции</a></li>
				<li> <a href="#Moder5" class="dropdown-item">Дополнительные возможности</a></li>
			  </ul>
			</li>
			<li class="nav-item dropdown">
			  <a href="#Admin" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Администратор</a>
			  <ul class="dropdown-menu">
				<li> <a href="#Admin" class="dropdown-item">Кто это</a></li>
				<li> <a href="#Admin1" class="dropdown-item">Редактирование профилей</a> </li>
				<li> <a href="#Admin2" class="dropdown-item">Редактирование экранов</a></li>
				<li> <a href="#Admin3" class="dropdown-item">Просмотр логов</a></li>
				<li> <a href="#Admin4" class="dropdown-item">Работа с логами</a></li>
				<li> <a href="#Admin5" class="dropdown-item">Дополнительные возможности</a></li>
			  </ul>
			</li>
			<li>
			  <!-- <a href="#limitation" class="nav-link">Ограничения</a> -->
			</li>
		  </ul>
		</div>
	  </nav>
	</div>
  </div>
  <div class="container intro" style="margin-top: 80px">
	<div class="content" id="bootstrapScroll">
	  <h3 id="preface"><strong> Здравствуйте, пользователи! </strong></h3>
	  <p>
		Данная страница предназначена для описания работы в EventController. Мы постарались подробно описать заложенный принцип
		взаимодействия, рассказать про работу в интерфейсе а также упомянуть нюансы использования некоторых функций. Наша задача
		сделать гайд максимально подробным, поэтому по мере усовершенствования системы, нахождения ошибок и багов и их исправления
		данная страница может дополняться и видоизменяться.
	  </p>
	  <p>
		Данный гайд содержит ссылки как и на определённые <a href="./guide">страницы в системе,</a> так и на определённые <a href="#preface">пункты внутри гайда.</a>
	  </p>
	  <p>
		Приятной работы в системе!
	  </p>
	  <p></p>
	  <!---------------------------------------------- НАВИГАЦИЯ ---------------------------------------------->
	  <h3 id="navigation" class="guide"><strong> Навигация по сайту </strong></h3>
	  <div class="lead">
	  	<p> Для навигации по сайту используется навигационная панель слева страницы </p>
	  	<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#nav1" aria-expanded="false">
				Как выглядит навигационная панель, какие там есть элементы и для кого они доступны
			  </button>
			</h2>
			<div id="nav1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/wjb0pFq.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	  <p></p>
	  <p>
		В навигационной панели отображаются страницы, которые вам доступны в силу вашей роли. Неавторизованным отображаются главная
		страница и страница гайда. Отметим, что "Уведомления" у роли редактора выступает информативной страницей, и они её могут её
		просматривать, но не могут сами оставлять уведомления.
	  </p>
	  <!---------------------------------------------- РЕДАКТОР ---------------------------------------------->
	  <h3 id="Editor" class="guide"><strong> Редактор (Editor) </strong></h3>
	  <div class="lead">
		<i> <p> Бригада студентов, отвечающих за составление программы трансляции. </p> </i>
	  	<p> Основная рабочая страница для Редакторов является <a href="./event">страница редактора.</a> </p>
	  </div>
	  <div class="accordion">
		<div class="accordion-item">
		  <h2 class="accordion-header">
			<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPage1" aria-expanded="false">
			  Как выглядит страница Редактора
			</button>
		  </h2>
		  <div id="EditorPage1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			<div class="accordion-body">
			  <img src="https://i.imgur.com/dTC6nWm.jpg" class="img-fluid" alt="">
			</div>
		  </div>
		</div>
	  </div>
	  <p></p>
	  <p> Вторичной, но не менее важной для работы редактора является <a href="./ads">страница уведомлений</a> </p>
	  <div class="accordion">
		<div class="accordion-item">
		  <h2 class="accordion-header">
			<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPage2" aria-expanded="false">
			  Как выглядит страница Уведомлений у Редактора
			</button>
		  </h2>
		  <div id="EditorPage2" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			<div class="accordion-body">
			  <img src="https://i.imgur.com/NjZf8S7.jpg" class="img-fluid" alt="">
			</div>
		  </div>
		</div>
	  </div>
	  <p></p>
	  <p>
		Подробнее про страницу уведомлений можно прочитать в пункте <a href="#Adsender">описания работы менеджера</a>
	  </p>
	  <div id="Editor1" class="guide">
		<h5><strong> 1. Интерфейс страницы Редактора </strong></h5>
		<p>
		  При открытии <a href="./event">страницы редактора</a> мы можем увидеть данный блок с кнопками и селектором
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorInterface1" aria-expanded="false">
				"Блок управления" на странице редактора
			  </button>
			</h2>
			<div id="EditorInterface1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/hfWfgwE.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  Разберём элементы блока поподробнее:
		</p>
		<p>
		  <strong> 1. Селектор (- Выберите -) </strong> - в нём отображаются все шаблоны, которые вы можете просматривать (которые видны вам).
		  Про <a href="#Editor21">шаблоны,</a> что это такое, как задать им <a href="#Editor22">настройки видимости</a>
		  и что это означает подробнее будет рассказано позже.
		</p>
		<p>
		  <strong> 2. Кнопка "Открыть" </strong> - при нажатии на данную кнопку выбранный вами шаблон в селекторе (1) откроется.
		</p>
		<p>
		  <strong> 3. Поле ввода "Имя нового шаблона" </strong> - в данном поле нужно будет указать имя при создании нового шаблона.
		  Обратите внимание, что в имени шаблона нельзя использовать запрещённые символы и длина этого имени не должна превышать 30 символов.
		  Также учтите, что данное имя будет видно при <a href="#Editor3">отправке модератору,</a> и после создания <strong>его нельзя изменить.</strong>
		</p>
		<p>
		  <strong> 4. Кнопка "Создать пустой" </strong> - при нажатии на данную кнопку будет создан шаблон с именем,
		  которое вы указали в поле ввода (3). При этом созданный шаблон будет пустым, то есть <strong>в нём не будет событий.</strong>
		</p>
		<p>
		  <strong> 5. Кнопка "Создать по умолчанию" </strong> - при нажатии на данную кнопку будет создан шаблон с именем,
		  которое вы указали в поле ввода (3). При этом созданный шаблон будет содержать в себе <strong>некоторый набор WEB-форм
		  а также страницу объявлений /adscast</strong>
		</p>
		<p>
		  <strong> 6. Кнопка "Создать копию" </strong> - при нажатии на данную кнопку будет создана копия открытого шаблона с именем,
		  которое вы указали в поле ввода (3). При этом созданная копия будет содержать в себе <strong>все события первоначального шаблона.</strong>
		</p>
		<p>
		  <strong> 7. Кнопка "Отправить" </strong> - при нажатии на данную кнопку откроется диалоговое окно с формой на отправку
		  модератору. Подробнее про это можно прочитать в пункте про <a href="#Editor3">отправку формы.</a>
		</p>
	  </div>

	  <div id="Editor21" class="guide">
		<h5><strong> 2.1 Шаблоны и работа с ними</strong></h5>
		<p>
		  Программа трансляции состоит из <i> одного </i> (специальное расписание) или <i> нескольких </i> (стандартное расписание)
		  <strong> шаблонов.</strong> Указать, в каком виде будет представлена программа трансляции можно в диалоговом окне при
		  <a href="#Editor3">отправке формы</a>
		</p>
		<p>
		  В системе можно создать 2 вида шаблонов ("пустой" и "по
		  умолчанию"). Шаблон по умолчанию содержит базовые WEB-формы
		  кафедры с сайта webrobo, а также страницу с отображениями объявлений /adscast
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern1" aria-expanded="false">
				Создание шаблонов
			  </button>
			</h2>
			<div id="EditorPattern1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				Кнопка для создание пустого шаблона (в нём не будет событий)
				<img src="https://i.imgur.com/0fKTV1a.png" class="img-fluid" alt="">
				Кнопка для создание шаблона "По умолчанию" (в нём будет некоторые WEB-формы с сайта webrobo, а также страница
				с отображениями объявлений /adscast)
				<img src="https://i.imgur.com/ZUxkrNJ.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  Также можно создать копию любого шаблона, <a href="#Editor22">доступного к просмотру.</a> Для этого
		  необходимо открыть нужный шаблон, ввести имя шаблона-копии в поле
		  нового шаблона и нажать "Создать копию".
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern2" aria-expanded="false">
				Как это выглядит
			  </button>
			</h2>
			<div id="EditorPattern2" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/6zj7T7Z.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  Каждый <strong> шаблон </strong> состоит из последовательности <strong> событий, </strong> которую можно
		  настраивать.
		</p>
		<p> Каждое <strong> событие </strong> имеет:</p>
		<p>
		  1. <strong> ИМЯ </strong> (для определения события / может
		  повторяться среди событий),
		</p>
		<p>
		  2. <strong> РЕСУРС </strong>(ссылка на ресурс - картинку /
		  WEB-форму / видео),
		</p>
		<p>
		  3. <strong> ТИП РЕСУРСА </strong> (важно указать правильно,
		  поскольку это может привести к черному экрану на трансляции),
		</p>
		<p>
		  4. <strong> ВРЕМЯ </strong> (в течение которого будет висеть
		  событие, прежде чем переключиться на следующее В СЕКУНДАХ).
		</p>
		<p>
		  5. <strong> ПОРЯДОК </strong> (место, где находится событие внутри шаблона и есть порядок - чем выше расположено событие,
		  тем раньше оно будет воспроизведено).
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern3" aria-expanded="false">
				Как выглядит событие в шаблоне
			  </button>
			</h2>
			<div id="EditorPattern3" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/52IFbVE.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>В системе у редактора есть возможность:</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern4" aria-expanded="false">
				Добавлять новые шаблоны, удалять ненужные или неактуальные
			  </button>
			</h2>
			<div id="EditorPattern4" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/v0KBGie.png" class="img-fluid" alt="" >
				<p></p>
				<p>
				  Для удаления шаблона нужно сначала выбрать и открыть тот шаблон, который вы хотите удалить, после чего нажать на кнопку
				  "Удалить" слева от кнопки "Отправить" и подтвердить удаление в открывшемся диалоговом окне.
				</p>
				<p>
				  <strong> ! ВАЖНО: </strong> удалять шаблон, и/или менять параметры
				  его видимости может только автор шаблона!
				</p>
			  </div>
			</div>
		  </div>
		</div>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern5" aria-expanded="false">
				Добавлять новые события в шаблонах, редактировать имеющиеся или удалять ненужные или неактуальные
			  </button>
			</h2>
			<div id="EditorPattern5" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<p>
				  Для того, чтобы редактировать событие в шаблоне нужно нажать на кнопку "Редактировать" справа от времени события
				</p>
				<img src="https://i.imgur.com/moJTAgv.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  После этого поля события будут разблокированы, и их можно будет редактировать
				</p>
				<img src="https://i.imgur.com/XqAJqyA.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  <strong>Имя события</strong> даёте вы. Оно нужно для того, чтобы ориентироваться среди других событий. Важно знать,
				  что <strong>имя события не может содержать запрещённые символы и быть длиннее 50 символов.</strong>
				</p>
				<p>
				  <strong>Ссылка на ресурс,</strong> что логично, должна содержать ссылку. Это может быть как изображение, так и сайт,
				  или, быть может, таблица
				</p>
				<p>
				  Обратите внимание на <strong>тип события.</strong> На данный момент события могут быть представлены в виде ссылки на
				  изображение - в этом случае необходимо выбрать "Изображение", или же виде ссылки на форму/сайт - в этом случае необходимо
				  выбрать "WEB-форма". <strong>Параметр "Видео" на данный момент недоступен.</strong>
				</p>
				<p>
				  <strong>Время</strong> - это то, сколько секунд после переключения на данное событие оно будет отображаться на экране.
				</p>
				<p>
				  Для сохранения внесённых изменений в событие или его удаления нужно нажать на кнопку <strong>"Сохранить"</strong>
				  или <strong>"Удалить"</strong> соответственно.
				</p>
				<p>
				  <strong> ! ВАЖНО: </strong> Любые ваши <strong>изменения</strong> в событии и в шаблоне в целом на данной странице
				  <strong>происходят локально.</strong> Для того, чтобы данные изменения применились в системе необходимо нажать на
				  кнопку "Сохранить" справа от кнопки открытия шаблона (2). Если вы покинете страницу без нажатия на данную кнопку
				  <strong>изменения не сохранятся.</strong>
				</p>

			  </div>
			</div>
		  </div>
		</div>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern6" aria-expanded="false">
				Менять порядок проигрывания событий внутри
			  </button>
			</h2>
			<div id="EditorPattern6" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				До:
				<img src="https://i.imgur.com/Pj4vhOA.png" class="img-fluid" alt="">
				После:
				<img src="https://i.imgur.com/F5jxPrf.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  Для того, <strong> чтобы внесённые изменения в шаблон сохранились в системе, нужно нажать на кнопку "Сохранить"</strong>
		  справа от кнопки "Открыть" и подтвердить сохранение изменений в открывшемся диалоговом окне.
		</p>
		<div id="Editor22" class="guide">
		  <h5><strong> 2.2 - Настройка видимости шаблонов </strong></h5>
		  <p> На странице редактора также возможно установить шаблон видимым для других бригад, и/или дать доступ на его редактирование.</p>
		  <p>
			<strong> ! ВАЖНО: </strong> удалять шаблон, и/или менять параметры
			его видимости может только автор шаблона!
		  </p>
		  <div class="accordion">
			<div class="accordion-item">
			  <h2 class="accordion-header">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern7" aria-expanded="false">
				  Как это выглядит
				</button>
			  </h2>
			  <div id="EditorPattern7" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
				<div class="accordion-body">
				  Ни один режим не включен:
				  <img src="https://i.imgur.com/pTqEtRp.png" class="img-fluid" alt="">
				  Включен режим "Разрешить просматривать"
				  <img src="https://i.imgur.com/hU7OMio.png" class="img-fluid" alt="">
				  Включен режим "Разрешить редактировать"
				  <img src="https://i.imgur.com/VlOHVLC.png" class="img-fluid" alt="">
				</div>
			  </div>
			</div>
		  </div>
		  <p></p>
		  <p>Подробнее про настройки видимости шаблона:</p>
		  <p>
			- <strong><i> Ни один режим не включен </i></strong> - другие профили не могут ни
			просматривать, ни вносить изменения в данный шаблон (шаблон
			является приватным)
		  </p>
		  <p>
			- <strong><i> Включен режим "Разрешить просматривать" </i></strong> - другие
			профили могут видеть содержимое шаблона и создать копию шаблона
			для себя, не изменяя данный шаблон (кнопка "создать копию"). При
			активном режиме появляется второй switch - "Разрешить
			редактировать"
		  </p>
		  <p>
			- <strong><i> Включен режим "Разрешить редактировать" </i></strong> - другие
			профили могут как просматривать, так и вносить изменения в данный
			шаблон (шаблон данного типа является общим)
		  </p>
		</div>
		<p>
		  На странице редактора вы можете открыть любой шаблон, который вам доступен. Как уже было сказано вы можете открывать не только
		  созданные вами шаблоны, но и те, для которых другие пользователи в системе установили соответствующие настройки видимости.
		</p>
		<p>
		  Как отображаются открытые шаблоны:
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern8" aria-expanded="false">
				Если шаблон ваш
			  </button>
			</h2>
			<div id="EditorPattern8" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/6hlmPzQ.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern9" aria-expanded="false">
				Если шаблон не ваш, но доступен вам для редактирования
			  </button>
			</h2>
			<div id="EditorPattern9" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/B3SffSP.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorPattern10" aria-expanded="false">
				Если шаблон не ваш, и не доступен вам для редактирования
			  </button>
			</h2>
			<div id="EditorPattern10" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/88l82OL.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  <strong> ! ВАЖНО: </strong> Обратите внимание, что кнопка "Удалить" справа от селектора открытия шаблона, а также кнопки настройки
		  видимости шаблона отображаются только в том случае, если вы являетесь автором шаблона.
		</p>
	  </div>
	  <div id="Editor3" class="guide">
		<h5><strong> 3. Отправка программы трансляции на утверждение </strong></h5>
		<div>
		  Для того, чтобы отправить программу трансляции на модерацию, для начала вам нужно подготовить шаблоны, которые вы хотите отправить,
		  и запомнить их названия. Далее необходимо нажать на кнопку <strong>"Отправить"</strong> справа от надписи "Открыть" шаблон. После нажатия
		  появляется диалоговое окно:
		  <div class="accordion">
			<div class="accordion-item">
			  <h2 class="accordion-header">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorSendForm1" aria-expanded="false">
				  Как выглядит интерфейс отправки формы модератору
				</button>
			  </h2>
			  <div id="EditorSendForm1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
				<div class="accordion-body">
				  <img src="https://i.imgur.com/MHkJiJT.png" class="img-fluid" alt="">
				</div>
			  </div>
			</div>
		  </div>
		  <p></p>
		  <p>
			При этом программа трансляции может быть представлена как в виде 3х шаблонов, каждый из которых отвечает за определённый промежуток
			времени (будние дни), как и в виде одного шаблона на целый день (особое расписание).
		  </p>
		  <p>
			Ознакомится с тем, в какой момент времени происходит переключение шаблонов в программе трансляции, и на какой шаблон происходит
			переключение можно из таблицы ниже:
		  </p>
		  <div class="accordion">
			<div class="accordion-item">
			  <h2 class="accordion-header">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorSendForm2" aria-expanded="false">
				  Таблица смены шаблонов программы трансляции для будних дней
				</button>
			  </h2>
			  <div id="EditorSendForm2" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
				<div class="accordion-body">
				  <table class="table table-striped">
					<thead>
					Таблица смены шаблонов программы трансляции для будних дней
					<tr>
					  <th scope="col">#</th>
					  <th scope="col">Начало</th>
					  <th scope="col">Конец</th>
					  <th scope="col">Шаблон</th>
					</tr>
					</thead>
					<tbody>
					<tr>
					  <th scope="row">1</th>
					  <td>00:01</td>
					  <td>08:20</td>
					  <td>Обед</td>
					</tr>
					<tr>
					  <th scope="row">2</th>
					  <td>08:20</td>
					  <td>08:40</td>
					  <td>Перерыв</td>
					</tr>
					<tr>
					  <th scope="row">3</th>
					  <td>08:40</td>
					  <td>10:15</td>
					  <td>Пара (1)</td>
					</tr>
					<tr>
					  <th scope="row">4</th>
					  <td>10:15</td>
					  <td>10:25</td>
					  <td>Перерыв</td>
					</tr>
					<tr>
					  <th scope="row">5</th>
					  <td>10:25</td>
					  <td>12:00</td>
					  <td>Пара (2)</td>
					</tr>
					<tr>
					  <th scope="row">6</th>
					  <td>12:00</td>
					  <td>12:50</td>
					  <td>Обед</td>
					</tr>
					<tr>
					  <th scope="row">7</th>
					  <td>12:50</td>
					  <td>14:25</td>
					  <td>Пара (3)</td>
					</tr>
					<tr>
					  <th scope="row">8</th>
					  <td>14:25</td>
					  <td>14:35</td>
					  <td>Перерыв</td>
					</tr>
					<tr>
					  <th scope="row">9</th>
					  <td>14:35</td>
					  <td>16:10</td>
					  <td>Пара (4)</td>
					</tr>
					<tr>
					  <th scope="row">10</th>
					  <td>16:10</td>
					  <td>16:20</td>
					  <td>Перерыв</td>
					</tr>
					<tr>
					  <th scope="row">11</th>
					  <td>16:20</td>
					  <td>17:55</td>
					  <td>Пара (5)</td>
					</tr>
					<tr>
					  <th scope="row">12</th>
					  <td>17:55</td>
					  <td>00:01</td>
					  <td>Обед</td>
					</tr>
					</tbody>
				  </table>
				</div>
			  </div>
			</div>
		  </div>
		  <p></p>
		  <p>
			При отправке формы необходимо указать, в каком именно формате программа трансляции будет играть
		  </p>
		  <div class="accordion">
			<div class="accordion-item">
			  <h2 class="accordion-header">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorSendForm3" aria-expanded="false">
				  Указание типа программы трансляции при отправке:
				</button>
			  </h2>
			  <div id="EditorSendForm3" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
				<div class="accordion-body">
				  <p>Стандартная (3 разных шаблона на ПАРЫ, ПЕРЕРЫВ и ОБЕД)</p>
				  <img src="https://i.imgur.com/QGzIErQ.png" class="img-fluid" alt="">
				  <p></p>
				  <p>Особая (один шаблон на весь день)</p>
				  <img src="https://i.imgur.com/bs1RVn0.png" class="img-fluid" alt="">
				</div>
			  </div>
			</div>
		  </div>
		  <p></p>
		</div>
		<p>
		  Помимо этого, в системе нужно выбрать дату, на которую необходимо поставить программу трансляции, а также выбрать те шаблоны,
		  которые вы хотите установить (вы их запоминали ранее). Так же можно написать комментарий для модератора, если потребуется (не обязательно).
		  По умолчанию дата устанавливается на текущий день.
		</p>
		<p>
		  При отправке стандартного шаблона с параметром в одном или двух полях "без изменений" произойдет копирование шаблона для данного пункта из п
		  программы текущего дня, если такое возможно (удобно, если часть расписания в ближайшие два дня, например, на обед, останется одинаковой).
		</p>
		<p>
		  Если в системе по какой-либо причине отсутствуют шаблоны на текущий день, редактор должен заполнить все поля при отправке формы.
		</p>
		<p>
		  <strong> ! ВАЖНО: </strong> информация о статусе отправленного редактором запроса в случае утверждения или отклонения модератором персонально
		  поступает в ваш раздел уведомлений. Поэтому заглядывайте, если необходимо получить обратную информацию от модератора.
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#EditorSendForm4" aria-expanded="false">
				Уведомления у редактора после утверждения / отклонения отправленного ими шаблона
			  </button>
			</h2>
			<div id="EditorSendForm4" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/JSawg8u.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	  <p></p>
	  <div id="Editor4" class="guide">
		<h5><strong> Обратите внимание на нюансы: </strong></h5>
		<p>
		  При отправке шаблонов на трансляцию создается резервная копия, поэтому отправленные на модерацию шаблоны можно продолжать редактировать уже после отправки. Однако стоит учесть, что в случае отклонения запроса на утверждение модератором, копия бесследно исчезает из системы, поэтому советуем хранить резервные копии.
		</p>
	  </div>

	  <hr />
	  <!---------------------------------------------- МЕНЕДЖЕР ---------------------------------------------->
	  <h3 id="Adsender" class="guide"><strong> Менеджер (Adsender) </strong></h3>
	  <div class="lead">
		<i> Человек, который размещает важные объявления в системе и на трансляции.</i>
		<p> Основная рабочая страница для Менеджера является <a href="./ads">страница уведомлений.</a> </p>
	  </div>
	  <div class="accordion">
		<div class="accordion-item">
		  <h2 class="accordion-header">
			<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#AdsenderPage1" aria-expanded="false">
			  Как выглядит страница Уведомлений у Менеджера
			</button>
		  </h2>
		  <div id="AdsenderPage1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			<div class="accordion-body">
			  <img src="https://i.imgur.com/G2S8IfI.png" class="img-fluid" alt="">
			</div>
		  </div>
		</div>
	  </div>
	  <p></p>
	  <div id="Adsender1" class="guide">
		<h5><strong> 1. Интерфейс страницы Уведомлений </strong></h5>
		<p>
		  При открытии страницы Уведомлений мы можем увидеть данный блок с кнопками.
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#AdsenderInterface1" aria-expanded="false">
				Блок управления уведомлениями на странице Уведомлений
			  </button>
			</h2>
			<div id="AdsenderInterface1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/EaKKdg5.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  <strong> ! ВАЖНО: </strong> для роли "Редактор" на данной странице не будет возможности оставлять оповещения.
				</p>
				<p>
				  Т.е. для редакторов данная страница будет выглядеть следующим образом:
				</p>
				<img src="https://i.imgur.com/TlLNqpD.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  Разберём элементы блока поподробнее:
		</p>
		<p>
		  <strong> 1. Локальное объявление </strong> -
		  данное уведомление видно только авторизованным пользователем в системе и не будет отображается на экране.
		  Носит сугубо информативный характер, например, для оперативной связи с действующей бригадой редакторов.
		</p>
		<p>
		  <strong> 2. Общедоступное объявление </strong> -
		  данное уведомление видно всем, включая неавторизованных пользователей, а также отображается на главной
		  странице сайта и на экране. Такие объявления в системе помечаются звёздочкой (★) перед заголовком уведомления
		</p>
		<p>
		  <strong> 3. Поле ввода "Заголовок уведомления" </strong> -
		  в данном поле нужно будет указать заголовок при создании нового объявления.
		</p>
		<p>
		  <strong> 4. Поле ввода "Сообщение" </strong> -
		  в данном поле нужно указать текст объявления. Ограничений на количество символов нет, однако от этого
		  зависит внешний вид уведомлений на экране (чем меньше текста, тем больше объявлений поместится).
		</p>
		<p>
		  <strong> 5. Переключатель "Отображать на трансляции" </strong> -
		  активировав данный селектор, объявление будет помещено на специальное окно внутри трансляции,
		  которое будет видно для всех, а также выводиться в нужном порядке на экран - это позволит отображать
		  на трансляции исключительно важные объявления. Напомним, что на данной странице такие объявления
		  помечаются звёздочкой (★) перед заголовком уведомления
		</p>
		<p>
		  <strong> 6. Переключатель "Бессрочное объявление" </strong> -
		  активировав данный селектор, объявление в системе будет находится до тех пор, пока его не удалят вручную.
		  В противном случае, если селектор не активирован, объявление удалиться автоматически в конце указанного в поле (8) дня.
		</p>
		<p>
		  <strong> 7. Поле даты "Актуально до" </strong> -
		  при выключенном селекторе (6) объявление автоматически удалиться из системы в конце указанной в это поле даты.
		</p>
		<p>
		  <strong> 8. Кнопка "Отправить уведомление" </strong> -
		  отправляет уведомление с заданным заголовком и текстом в систему с указанием автора уведомления и его актуальности.
		  Обратите внимание, что <strong>заголовок и текст сообщения, а также настройку (5) и (6) нельзя изменить после отправки.</strong>
		  При этом поля заголовка и сообщения не обязательно должны быть заполнены - при необходимости их можно оставить пустыми.
		</p>
		<p>
		  <strong> 9. Кнопка "Удалить" напротив уведомления </strong> -
		  при нажатии на кнопку данное уведомление удалится из системы. У редакторов данная кнопка доступна только напротив
		  "персональных" уведомлений от системы (пункты 10-12)
		</p>
		<p>
		  <strong> 10. Уведомление "Запрос отклонён" </strong> -
		  Персональное уведомление. Оно адресуются конкретному пользователю из системы. <strong>Другие пользователи его не видят.</strong>
		  Оно имеет <strong>красный цвет</strong> и оповещают редакторов о том, что отправленный ими <strong>запрос на модерацию был отклонён</strong>,
		  а также содержит комментарий от модератора. Такие уведомления заносятся в автоматическое удаление через 3 дня, однако, при желании,
		  редактор может его удалить самостоятельно.
		</p>
		<p>
		  <strong> 11. Уведомление "Запрос утверждён" </strong> -
		  Аналогично пункту 10 персональное уведомление, но имеет <strong>зелёный цвет</strong> и оповещают об
		  <strong>утверждении отправленного ими запроса.</strong>
		</p>
		<p>
		  <strong> 12. Уведомление "Запрос отправлен" </strong> -
		  Аналогично пункту 10 персональное уведомление, но имеет <strong>голубой цвет</strong> и информирует о том, что
		  <strong>запрос был успешно отправлен</strong> на модерацию.
		</p>
	  </div>

	  <hr />
	  <!---------------------------------------------- МОДЕРАТОР ---------------------------------------------->
	  <h3 id="Moder" class="guide"><strong> Модератор (Moder) </strong></h3>
	  <div class="lead guide">
		<i> Человек, который утверждает и редактирует расписание на трансляции событий.</i>
	  	<p> Основная рабочая страница для Модератора является <a href="./moder">страница модератора.</a> </p>
	  </div>
	  <p>
		На странице модератора есть 3 вкладки:
	  </p>
	  <div class="accordion">
		<div class="accordion-item">
		  <h2 class="accordion-header">
			<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerInterface1" aria-expanded="false">
			  Вкладка "Запросы на модерацию"
			</button>
		  </h2>
		  <div id="ModerInterface1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			<div class="accordion-body">
			  <img src="https://i.imgur.com/KYmAwQ6.jpg" class="img-fluid" alt="">
			</div>
		  </div>
		</div>
	  </div>
	  <div class="accordion">
		<div class="accordion-item">
		  <h2 class="accordion-header">
			<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerInterface2" aria-expanded="false">
			  Вкладка "Активное отображение"
			</button>
		  </h2>
		  <div id="ModerInterface2" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			<div class="accordion-body">
			  <img src="https://i.imgur.com/XMeCfS2.jpg" class="img-fluid" alt="">
			</div>
		  </div>
		</div>
	  </div>
	  <div class="accordion">
		<div class="accordion-item">
		  <h2 class="accordion-header">
			<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerInterface3" aria-expanded="false">
			  Вкладка "Очередь отображения"
			</button>
		  </h2>
		  <div id="ModerInterface3" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			<div class="accordion-body">
			  <img src="https://i.imgur.com/aHNy3hx.jpg" class="img-fluid" alt="">
			</div>
		  </div>
		</div>
	  </div>
	  <p></p>
	  <p>
		Помимо этого, немаловажными для редактора являются <a href="./event">страница редактора</a> и
		<a href="./ads">страница уведомлений</a>.
	  </p>
	  <p>
		О том, почему данные страницы важны для модератора описано <a href="#Moder4">вот здесь.</a>
	  </p>
	  <p>
		Возвращаясь к функционалу Модератора - каждая из вышеперечисленных вкладок отвечает за определённые действие в системе.
		Расскажем про это поподробнее:
	  </p>

	  <div id="Moder1" class="guide">
		<h5><strong> 1. Вкладка "Запросы на модерацию" </strong></h5>
		<p>
		  На данной вкладке отображаются все запросы, отправленные на утверждение.
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerRequest1" aria-expanded="false">
				Как выглядят запросы на странице модератора
			  </button>
			</h2>
			<div id="ModerRequest1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/x2WANdk.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  Разберём элементы вкладки поподробнее:
		</p>
		<p>
		  <strong> 1. Заголовок и комментарий запроса </strong> -
		  в данном месте отображаются заголовок и комментарий, заполненные пользователем при отправке данной программы
		  трансляции, а также имя этого пользователя.
		</p>
		<p>
		  <i> 1.1. Отправлен шаблон для "Будних дней" </i>
		</p>
		<p>
		  <i> 1.2. Отправлен шаблон для "Дня по особому расписанию" </i>
		</p>
		<p>
		  <strong> 2. Селектор выбора экрана </strong> -
		  при отправке шаблона бригада указывает, на каком экране будет воспроизводиться присланная ими программа.
		  В дальнейшем, при <a href="#Moder4">обработке программы трансляции</a> модератор, при необходимости, может поменять экран отображения.
		</p>
		<p>
		  <strong> 3. Селектор выбора даты </strong> -
		  при отправке шаблона бригада указывает, на какую дату они хотят установить присланную ими программ.
		  В дальнейшем, при <a href="#Moder4">обработке программы трансляции</a> модератор, при необходимости, может поменять дату.
		</p>
		<p>
		  <strong> 4. Отправленная программа трансляции </strong> -
		  может быть представлена как в виде одного шаблона, содержимого которого будет по кругу воспроизводится целый день,
		  так и в виде 3х шаблонов, каждый из которых будет отображаться в заданное для него время.
		</p>
		<p>
		  <i> 4.1. Отправлена программа для "Будних дней" </i> -
		  представлена в виде 3х шаблонов, для ПАР, ПЕРЕРЫВА, и ОБЕДА. Напротив соответствующих надписей располагаются селекторы
		  с указанием присланных шаблонов. Поменять присланные шаблоны, а также поменять их содержимое возможно
		  при <a href="#Moder4">обработке программы трансляции.</a>
		</p>
		<p>
		  Ознакомится с тем, в какой момент времени происходит переключение шаблонов в программе трансляции,
		  и на какой шаблон происходит переключение можно из таблицы ниже:
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerRequest2" aria-expanded="false">
				Таблица смены шаблонов программы трансляции для будних дней
			  </button>
			</h2>
			<div id="ModerRequest2" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<table class="table table-striped">
				  <thead>
				  Таблица смены шаблонов программы трансляции для будних дней
				  <tr>
					<th scope="col">#</th>
					<th scope="col">Начало</th>
					<th scope="col">Конец</th>
					<th scope="col">Шаблон</th>
				  </tr>
				  </thead>
				  <tbody>
				  <tr>
					<th scope="row">1</th>
					<td>00:01</td>
					<td>08:20</td>
					<td>Обед</td>
				  </tr>
				  <tr>
					<th scope="row">2</th>
					<td>08:20</td>
					<td>08:40</td>
					<td>Перерыв</td>
				  </tr>
				  <tr>
					<th scope="row">3</th>
					<td>08:40</td>
					<td>10:15</td>
					<td>Пара (1)</td>
				  </tr>
				  <tr>
					<th scope="row">4</th>
					<td>10:15</td>
					<td>10:25</td>
					<td>Перерыв</td>
				  </tr>
				  <tr>
					<th scope="row">5</th>
					<td>10:25</td>
					<td>12:00</td>
					<td>Пара (2)</td>
				  </tr>
				  <tr>
					<th scope="row">6</th>
					<td>12:00</td>
					<td>12:50</td>
					<td>Обед</td>
				  </tr>
				  <tr>
					<th scope="row">7</th>
					<td>12:50</td>
					<td>14:25</td>
					<td>Пара (3)</td>
				  </tr>
				  <tr>
					<th scope="row">8</th>
					<td>14:25</td>
					<td>14:35</td>
					<td>Перерыв</td>
				  </tr>
				  <tr>
					<th scope="row">9</th>
					<td>14:35</td>
					<td>16:10</td>
					<td>Пара (4)</td>
				  </tr>
				  <tr>
					<th scope="row">10</th>
					<td>16:10</td>
					<td>16:20</td>
					<td>Перерыв</td>
				  </tr>
				  <tr>
					<th scope="row">11</th>
					<td>16:20</td>
					<td>17:55</td>
					<td>Пара (5)</td>
				  </tr>
				  <tr>
					<th scope="row">12</th>
					<td>17:55</td>
					<td>00:01</td>
					<td>Обед</td>
				  </tr>
				  </tbody>
				</table>
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  <i> 4.2. Отправлен программа для "Дня по особому расписанию" </i> -
		  аналогично пункту 4.1, однако представлена в виде одного шаблона.
		</p>
		<p>
		  <strong> ! ВАЖНО: </strong> Обратите внимание, что в системе может находится несколько запросов на одну
		  и туже дату, однако при <a href="#Moder4">обработке</a> в случае наличия уже <a href="#Moder2">утверждённых шаблонов</a>
		  на данную дату система выдаст ошибку. Т.е. <strong>на одну дату нельзя утвердить более одного шаблона.</strong>
		</p>
		<p>
		  <strong> 5. Переключение типа программы трансляции </strong> -
		  изменяет тип программы трансляции. В запросе отображается тот тип, который указали при отправке запроса.
		  При <a href="#Moder4">обработке</a> модератор, при необходимости, данный тип может поменять.
		</p>
		<p>
		  <i> 5.1. Отправлена программа трансляции для "Будних дней" </i> -
		  селектор находится в выключенном положении. В пункте 4 можно указать 3 шаблона, отдельно для каждого промежутка.
		  (Ознакомится с таблицей смены шаблонов можно в п.4)
		</p>
		<p>
		  <i> 5.2. Отправлена программа трансляции для "Дня по особому расписанию" </i> -
		  селектор находится в включенном положении. В пункте 4 можно указать только 1 шаблон,
		  который будет отображаться на экране целый день.
		</p>
		<p>
		  <strong> 6. Кнопка "Обработать" </strong> -
		  при нажатии на данную кнопку будет разблокирована возможность редактировать выбранную программу трансляции.
		</p>
		<p>
		  <strong> ! ВАЖНО: </strong> При нажатии на данную кнопку возможность обработки данной программы у
		  других пользователей <strong>автоматически блокируется.</strong>
		</p>
		<p>
		  Также стоит отметить, что <strong>1 пользователь может одновременно обрабатывать только 1 программу.</strong>
		  При попытке начать обработку ещё одной трансляции модератор получит сообщение об ошибке.
		</p>
		<p>
		  Подробнее про это можно прочитать в пункте про <a href="#Moder4">обработку программы трансляции.</a>
		</p>
	  </div>
	  <div id="Moder2" class="guide">
		<h5><strong> 2. Очередь отображения </strong></h5>
		<p>
		  На вкладке <strong> "Очередь отображения" </strong> возможно <a href="#Moder1">таким же образом</a>
		  вносить изменения при необходимости, как и при обработке запроса.
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerQueue" aria-expanded="false">
				Как выглядит вкладка очереди у Модератора
			  </button>
			</h2>
			<div id="ModerQueue" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/aHNy3hx.jpg" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
	  </div>
	  <div id="Moder3" class="guide">
		<h5><strong> 3. Активное отображение </strong></h5>
		<p>
		  На вкладке <strong> "Активное отображение" </strong> возможно менять параметры и редактировать трансляцию в реальном времени. 
		  Здесь ровно <a href="#Moder1">таким же образом</a> можно вносить изменения, однако, в отличии от других вкладок, здесь нет
		  кнопки "Удалить", а также заголовка и комментария.
		</p>
	  </div>
	  <div class="accordion">
		<div class="accordion-item">
		  <h2 class="accordion-header">
			<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerActive" aria-expanded="false">
			  Как выглядит вкладка активного отображения у Модератора
			</button>
		  </h2>
		  <div id="ModerActive" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			<div class="accordion-body">
			  <img src="https://i.imgur.com/XMeCfS2.jpg" class="img-fluid" alt="">
			</div>
		  </div>
		</div>
	  </div>
	  <p></p>
	  <div id="Moder4" class="guide">
		<h5><strong> 4. Обработка программы трансляции </strong></h5>
		<p>
		  Вы могли заметить, что на вкладках отображается информация о программе трансляции, а также о том, кто данную программу составил,
		  однако модератор также может детально просматривать и изменять содержимое трансляции.
		</p>
		<p>
		  Для этого нужно нажать на кнопку <strong>"обработать"</strong> (или <strong>"редактировать"</strong> для вкладки "Активное отображение") напротив программы трансляции.
		</p>
		<p>
		  <strong> ! ВАЖНО: </strong> При нажатии на данную кнопку возможность обработки данной программы у
		  других пользователей <strong>автоматически блокируется.</strong>
		</p>
		<p>
		  Также напоминаем, что <strong>1 пользователь может одновременно обрабатывать только 1 программу.</strong>
		  При попытке начать обработку ещё одной трансляции модератор получит сообщение об ошибке.
		</p>
		<p>
		  В зависимости от того, на какой вкладке начата обработка, интерфейс и расположение кнопок для редактирования может различаться,
		  однако общий принцип остаётся один.
		</p>
		<p>
		  <strong>Как это выглядит</strong>
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerProcessing1" aria-expanded="false">
				1. Вкладка "Запросы на модерацию"
			  </button>
			</h2>
			<div id="ModerProcessing1" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<p>
				  <strong>1.1. Программа для будних дней</strong>
				</p>
				<strong>До:</strong>
				<img src="https://i.imgur.com/mWwN0vB.png" class="img-fluid" alt="">
				<strong>После:</strong>
				<img src="https://i.imgur.com/D6Si6vr.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  <strong>1.2. Программа для дня по особому расписанию</strong>
				</p>
				<strong>До:</strong>
				<img src="https://i.imgur.com/5Uzhq7u.png" class="img-fluid" alt="">
				<strong>После:</strong>
				<img src="https://i.imgur.com/ol1TW9C.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  Что при этом происходит:
				</p>
				<p>
				  1. Вместо кнопки "Обработать" (6) появляется группа кнопок (6.1 - 6.4)
				</p>
				<p>
				  2. Селекторы для выбора экрана (2), даты (3) шаблона(ов) (4), а также переключатель (5) будут разблокированы.
				</p>
			  </div>
			</div>
		  </div>
		</div>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerProcessing2" aria-expanded="false">
				2. Вкладка "Очередь отображения"
			  </button>
			</h2>
			<div id="ModerProcessing2" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<p>
				  <strong>2.1. Программа для будних дней</strong>
				</p>
				<strong>До:</strong>
				<img src="https://i.imgur.com/LmyktYe.png" class="img-fluid" alt="">
				<strong>После:</strong>
				<img src="https://i.imgur.com/S7psloB.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  <strong>2.2. Программа для дня по особому расписанию</strong>
				</p>
				<strong>До:</strong>
				<img src="https://i.imgur.com/Hkiq7PA.png" class="img-fluid" alt="">
				<strong>После:</strong>
				<img src="https://i.imgur.com/hgyXzBB.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  Что при этом происходит:
				</p>
				<p>
				  1. Вместо кнопки "Обработать" (6) и "Играть сейчас" (7) появляется группа кнопок (6.1 - 6.4)
				</p>
				<p>
				  2. Селекторы для выбора экрана (2), даты (3) шаблона(ов) (4), а также переключатель (5) будут разблокированы.
				</p>
			  </div>
			</div>
		  </div>
		</div>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerProcessing3" aria-expanded="false">
				3. Вкладка "Активное отображение"
			  </button>
			</h2>
			<div id="ModerProcessing3" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<p>
				  <strong>3.1. Программа для будних дней</strong>
				</p>
				<strong>До:</strong>
				<img src="https://i.imgur.com/OwD2vbr.jpg" class="img-fluid" alt="">
				<strong>После:</strong>
				<img src="https://i.imgur.com/trmRfOR.jpg" class="img-fluid" alt="">
				<p></p>
				<p>
				  <strong>3.2. Программа для дня по особому расписанию</strong>
				</p>
				<strong>До:</strong>
				<img src="https://i.imgur.com/eM2Km9W.jpg" class="img-fluid" alt="">
				<strong>После:</strong>
				<img src="https://i.imgur.com/pUhY4UZ.jpg" class="img-fluid" alt="">
				<p></p>
				<p>
				  Что при этом происходит:
				</p>
				<p>
				  1. Вместо кнопки "Редактировать" появляется группа кнопок "Отмена", "Просмотр" и "Сохранить"
				</p>
				<p>
				  2. Селекторы для выбора шаблона(ов), а также переключатель особого расписания будут разблокированы.
				</p>
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		За что отвечают появившиеся кнопки:
		<p>
		  <strong> 1. Кнопка "Отменить обработку" </strong> (или <strong>"Отмена"</strong>) -
		  при нажатии на данную кнопку отменяется обработка программы трансляции.
		  Селекторы блокируются, вместо группы кнопок появляется кнопка "Обработать" (или "Редактировать"),
		  <strong>внесённые изменения в программу не сохраняются.</strong>
		</p>
		<p>
		  <strong> 2. Кнопка "Просмотр" </strong> -
		  при нажатии на данную кнопку появляется диалоговое окно, в котором можно <strong>просмотреть содержание тех
		  шаблонов, которые были указаны в селекторах программы до нажатия данной кнопки</strong>
		</p>
		<p>
		  В зависимости от присланной программы (на Будни или Особой), диалоговое окно будет выглядеть по-разному:
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerProcessing4" aria-expanded="false">
				Диалоговое окно просмотра для детального редактирования содержимого шаблонов при обработке программы
			  </button>
			</h2>
			<div id="ModerProcessing4" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<p>
				  <strong>1. Программа для будних дней</strong>
				</p>
				<img src="https://i.imgur.com/DzKOcww.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  В этом случае в вверху диалогового окна можно увидеть 3 вкладки: ПАРЫ, ПЕРЕРЫВ и ОБЕД.
				</p>
				<p>
				  На этих вкладках открываются шаблоны, которые были выбраны в соответствующих селекторах до нажатия кнопки "Просмотр".
				</p>
				<p>
				  <strong>2. Программа для дня по особому расписанию</strong>
				</p>
				<img src="https://i.imgur.com/mlEZZzc.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  В этом случае в диалоговом окне откроется один шаблон, который был выбран в соответствующем селекторе до нажатия кнопки "Просмотр".
				</p>
				<p>
				  <strong> ! ВАЖНО: </strong> Логика работы с событиями в шаблоне на данном окне полностью аналогично логике работы с событиями на странице редактора.
				</p>
				<p>
				  Подробно про это описывается в пункте про <a href="#Editor21">работу с шаблонами у редактора.</a>
				</p>
				<p>
				  Выйти из диалогового окна детального редактирования можно нажатием кнопки <strong>"Отмена"</strong>
				  (или крестик в верхнем правом углу) - тогда изменения внутри шаблонов не сохранятся (шаблоны останутся в первоначальном виде);
				  либо нажатием кнопки <strong>"Сохранить"</strong> - в этом случае изменения внутри шаблонов <strong>сохранятся, но только локально</strong>
				  (на стороне клиента). Для отправки внесённых изменений в систему (на сервер) необходимо нажать кнопку <strong>"Утвердить"</strong>
				  (на вкладке "Запросы на модерацию") или <strong>"Применить"</strong> (на вкладке "Очередь отображения")
				</p>
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  <strong> 3.1. Кнопка "Отклонить" </strong> -
		  данная кнопка появляется при обработке во вкладке "Запросы на модерацию".
		</p>
		<p>
		  При нажатии на данную кнопку появляется диалоговое окно, в котором можно указать комментарий для feedback-а
		  с пользователем, отправившим данную программу трансляции.
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerProcessing5" aria-expanded="false">
				Диалоговое окно для feedback-а при отклонении
			  </button>
			</h2>
			<div id="ModerProcessing5" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/QHZvd5m.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  По умолчанию комментарий устанавливается как "Исправить ошибки.". При необходимости, модератор может как убрать комментарий,
				  так и написать своё сообщение. Ограничения по количеству символов в данном окне нет.
				</p>
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  Данное сообщение персонально появится на странице уведомлений и будет храниться в системе 3 дня.
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerProcessing6" aria-expanded="false">
				Уведомления у редактора после утверждения / отклонения отправленного ими шаблона
			  </button>
			</h2>
			<div id="ModerProcessing6" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/JSawg8u.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  <strong> 3.2. Кнопка "Удалить" </strong> -
		  данная кнопка появляется при обработке во вкладке "Очередь отображения".
		</p>
		<p>
		  При нажатии на данную кнопку появляется диалоговое окно, в котором нужно подтвердить удаление. В этом случае
		  программа трансляции удалится из очереди вместе с её шаблонами и событиями.
		</p>
		<p>
		  <strong> 4.1 Кнопка "Утвердить" </strong> -
		  данная кнопка появляется при обработке во вкладке "Запросы на модерацию".
		</p>
		<p>
		  При нажатии на данную кнопку появляется диалоговое окно, в котором можно указать комментарий для feedback-а
		  с пользователем, который отправил данную программу трансляции.
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-sbs-toggle="collapse" data-bs-target="#ModerProcessing7" aria-expanded="false">
				Диалоговое окно для feedback-а при утверждении
			  </button>
			</h2>
			<div id="ModerProcessing7" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/iOaX717.png" class="img-fluid" alt="">
				<p></p>
				<p>
				  По умолчанию комментарий устанавливается как "Утверждаю.". При необходимости, модератор может как убрать комментарий,
				  так и написать своё сообщение. Ограничения по количеству символов в данном окне нет.
				</p>
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  Данное сообщение персонально появится на странице уведомлений и будет храниться в системе 3 дня.
		</p>
		<div class="accordion">
		  <div class="accordion-item">
			<h2 class="accordion-header">
			  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ModerProcessing8" aria-expanded="false">
				Уведомления у редактора после утверждения / отклонения отправленного ими шаблона
			  </button>
			</h2>
			<div id="ModerProcessing8" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			  <div class="accordion-body">
				<img src="https://i.imgur.com/JSawg8u.png" class="img-fluid" alt="">
			  </div>
			</div>
		  </div>
		</div>
		<p></p>
		<p>
		  <strong> 4.2. Кнопка "Применить" </strong> -
		  данная кнопка появляется при обработке во вкладке "Очередь отображения".
		</p>
		<p>
		  При нажатии на данную кнопку появляется диалоговое окно, в котором нужно подтвердить удаление. В этом случае
		  программа трансляции, лежащая в очереди, применит внесённые изменения.
		</p>
		<p>
		  <strong> 5. Кнопка "Играть сейчас" </strong> -
		  данная кнопка отображается во вкладке "Очередь отображения".
		</p>
		<p>
		  При нажатии на данную кнопку появится диалоговое окно, в котором нужно подтвердить действие.
		  При этом <strong>текущая активная трансляция удалится из системы,</strong> а выбранная трансляция
		  переместится из вкладки "Очередь отображения" на вкладку "Активное отображение".
		</p>
	  </div>


	  <div id="Moder5" class="guide">
		<h5><strong> Что ещё может делать модератор? </strong></h5>
		<p>
		  В отличие от двух предыдущих ролей: "Редактор" и "Менеджер", каждая из которых имеет разный функционал,
		  который не пересекается между собой, в роль модератора включён функционал предыдущих ролей.
		</p>
		<p>
		  То есть говоря иначе, по дополнительным возможностям <strong>модератор может делать все то же самое,
		  что <a href="#Editor">редактор</a> и <a href="#Adsender">менеджер.</a></strong>
		</p>
		<p>
		  Подробнее про работу на этих вкладках можно прочитать в описании функционала соответствующих ролей,
		  где всё описано достаточно детально.
		</p>
	  </div>

	  <hr />

	  <h3 id="Admin" class="guide"><strong> Администратор (Admin) </strong></h3>
	  <div class="lead">
		<i> Человек, который контролирует работу системы и модераторов </i>
	  	<p> Как таковых основных, индивидуальных вкладок для работы у администратора нет.</p>
	  </div>
	  <div id="Admin1" class="guide">
		<h5><strong> 1. Редактирование профилей </strong></h5>
		<p>
		  Администратор может <strong> добавлять, удалять профили, </strong> а также <strong> менять роль </strong>
		  каждого отдельно взятого профиля. На данный момент существует лишь одно ограничение на количество профилей
		  - доступная память сервера.
		</p>
	  </div>
	  <div class="accordion">
		<div class="accordion-item">
		  <h2 class="accordion-header">
			<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#AdminProfiles" aria-expanded="false">
			  Как выглядит вкладка редактирования профилей у Администратора
			</button>
		  </h2>
		  <div id="AdminProfiles" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
			<div class="accordion-body">
			  <img src="https://i.imgur.com/jDtk09h.png" class="img-fluid" alt="">
			</div>
		  </div>
		</div>
	  </div>
	  <p></p>


	  <div id="Admin2" class="guide">
		<h5><strong> 2. Редактирование экранов </strong></h5>
		<p>
		  На данный момент функционал не реализован.
		</p>
	  </div>
	  <div id="Admin3" class="guide">
		<h5><strong> 3. Просмотр логов </strong></h5>
		<p>
		  Каждое действие на сервере заносится в хранилище логов, которое выводится в данное окно в подробной форме со всеми деталями.
		</p>
		<p>
		  На данный момент функционал приостановлен.
		</p>
	  </div>
	  <div id="Admin4" class="guide">
		<h5><strong> 4. Работа с логами </strong></h5>
		<p>
		  На данный момент функционал не реализован.
		</p>
	  </div>
	  <div id="Admin5" class="guide">
		<h5><strong> Что ещё может делать администратор? </strong></h5>
		<p>
		  Как и в случае с модератором, в роль администратора включён функционал предыдущих ролей.
		</p>
		<p>
		  То есть говоря иначе, по дополнительным возможностям <strong>администратор может делать все то же самое, что <a href="#Moder">модератор,</a> и, соответственно, <a href="#Editor">редактор</a> и <a href="#Adsender">менеджер.</a></strong>
		</p>
		<p>
		  Подробнее про работу на этих вкладках можно прочитать в описании функционала соответствующих ролей, где всё описано достаточно детально.
		</p>
	  </div>
	</div>
  </div>
</template>

<script>
export default {
	inject: ['getSocket'],
	data() {
		return {
			socket: {}
		}
	},
	methods: {
		connect() {
			this.socket = this.getSocket();
			
			// this.socket.on('note:new', (data) => {
            //     this.session.noread++;
            // });
		}
	},
	mounted() {
		this.connect();

		let scrollSpy = new bootstrap.ScrollSpy(document.getElementById("bootstrapScroll"), {
			target: '#guideNavbar'
		});

		window.addEventListener('scroll', function() {
			scrollSpy.dispose();
			scrollSpy = new bootstrap.ScrollSpy(document.getElementById("bootstrapScroll"), {
				target: '#guideNavbar'
			});
		});
	}
}
</script>