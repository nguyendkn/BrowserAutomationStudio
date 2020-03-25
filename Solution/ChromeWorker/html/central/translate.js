_L = 
{
	"In order to debug BAS interface, open":{"ru": "Чтобы отлаживать интерфейс BAS, откройте"},
	"this link":{"ru": "эту ссылку"},
	"in Chrome browser":{"ru": "в браузере Chrome"},
	"Debug interface":{"ru": "Отладка интерфейса"},
	"Embedded languages":{"ru": "Встроенные языки"},
	"+ Add npm module":{"ru": "+ Добавить npm модуль"},
	"Proxies reconnect" :{"ru": "Восстановление соединения"},
	"Emulate mouse movements" :{"ru": "Эмулировать движения мыши"},
	"Interface settings" :{"ru": "Настройки интерфейса"},
	"Browser settings" :{"ru": "Настройки браузера"},
	"Top Panel Height (pixels)" :{"ru": "Высота Верхней Панели (пикселей)"},
	"Left Panel Width (pixels)" :{"ru": "Ширина Левой Панели (пикселей)"},
	"Zoom (%)" :{"ru": "Масштаб (%)"},
	"Enable Flash" :{"ru": "Использовать Флеш"},
	"Skip Frames" :{"ru": "Пропуск Кадров"},
	"Number of frames to skip in run mode. The higher the value, the lower the use of resources. 1 - means no skip, 75 is default value." :{"ru": "Пропуск кадров в рабочем режиме. Чем больше это значение, тем меньше используется ресурсов. 1 - означает отрисовывать все кадры, 75 - стандартное значение."},
	"Force UTF-8 Encoding" :{"ru": "Преобразовывать все страницы в UTF-8"},
	"Ok" :{"ru": "Ок"},
	"Cancel" :{"ru": "Отмена"},
	"Defaults" :{"ru": "По Умолчанию"},
	"Disable System Log" :{"ru": "Отключить лог системных сообщений"},
	"Restart browser process on thread start" :{"ru": "Перезапускать процесс в начале работы потока"},
	"Autostart debug interface on each run" :{"ru": "Запускать режим отладки при каждом запуске"},
	"Disable webrtc and canvas" :{"ru": "Отключить webrtc и canvas"},
	"Name:" :{"ru": "Название:"},
	"Version:" :{"ru": "Версия:"},
	"Close" :{"ru": "Закрыть"},
	"Add" :{"ru": "Добавить"},
	"module" :{"ru": "модуль"},

	"WebRTC ip list" :{"ru": "WebRTC список ip"},
	"Replace ips exposed by WebRTC with values from the field above. Each line of that field must contain single ip. This setting is for debugging purposes only, the proper way to set is using 'Proxy' action." :{"ru": "Заменить ip, возвращаемые WebRTC значениями из поля выше. Каждая строка этого поля должна содержать один ip. Этот параметр предназначен только для целей отладки, правильный способ изменения WebRTC ip - использовать действие 'Прокси'."},
	"Replace Ip" :{"ru": "Изменить Ip"},

	"This option determines how proxies will be applied to browser process: through tunnel or with routing all requests to curl library. First option is default and if proxy is set it will replace all direct network requests with requests through proxy. Second option replaces all chrome network stack with curl. The difference between them is that first option acts more like real browser, while second gives extra features like ipv6 proxy support and setting proxy for individual network requests.": {"ru": "Этот параметр определяет, как прокси будут применяться к процессу браузера: через туннель или с маршрутизацией всех запросов в библиотеку curl. Первый вариант работает по умолчанию, и если установлен прокси, то он заменит все сетевые запросы запросами через прокси. Второй вариант подменяет весь сетевой стек chrome на curl. Разница между ними заключается в том, что первый вариант больше похож на настоящий браузер, а второй дает дополнительные функции, такие как поддержка ipv6 прокси и установка прокси индивидуально для отдельных сетевых запросов."},

	"Frame skip tells BAS to postpond rendering page, executing javascript and do other browser work. The more you set this value, the lazier browser becomes. This parameter helps to save cpu time. On other hand setting it too high can cause your script will become unstable, you may encounter javascript errors and other unpredictable results. 1 - default value, no frame skip, 75 - CPU saving mode": {"ru": "Пропуск кадров указывает BAS откладывать рендеринг страницы, выполнение javascript и другие задания браузера. Чем больше вы устанавливаете это значение, тем более ленивым становится браузер. Этот параметр помогает экономить процессорное время. С другой стороны, установка этого параметра в слишком высокое значение может привести к тому, что ваш скрипт станет нестабильным, вы можете столкнуться с ошибками javascript и другими непредсказуемыми результатами. 1 - стандартное значение, без пропуска кадров, 75 - режим сохранения процессорного времени"},

	"Flash" :{"ru": "Флеш"},
	"Audio noise pattern" :{"ru": "Шаблон шума audio"},
	
	"Turn on" :{"ru": "Включить"},
	"Turn off" :{"ru": "Отключить"},
	"Flash may expose your identity and generally is not safe for usage. If you want to enable it, change setting above and install flash on your PC, like described" :{"ru": "Использование флеш может раскрыть ваш ip, включать эту настройку не рекомендуется. Если вы все же хотите включить ее, измените настройку выше и установите флеш на вашем ПК, как описано"},
	"here" :{"ru": "здесь"},
	"WebRTC may show your real ip even if you are using proxy." :{"ru": "Использование WebRTC также может раскрыть ваш ip даже если вы используете прокси."},
	"Add noise" :{"ru": "Добавить шум"},

	"Browser setting may be changed individually per each thread with \"Browser Settings\" action. Changing settings here will set them for all script." :{"ru": "Настройки браузера могут быть изменены индивидуально для каждого потока с помощью действия \"Настройки браузера\". Задание настроек в этом окне изменит их для всего скрипта."},
	"Canvas is html element with graphics like: shapes, images, text, etc. Different browsers and operation systems render canvas content slightly different. These differences may be exploited by sites to identify you among other users. BAS allows you protect you by disabling canvas or add custom noise to canvas content." :{"ru": "Canvas - это html элемент, который содержит графику: разнообразные фигуры, изображения, текст, и т. д. Разные браузеры и операционные системы рисуют эти элементы немного по разному. Сайт может использовать эти отличия чтобы идентифицировать вас среди других пользователей. BAS позволяет защитить вас отключая canvas элемент полностью или добавляя шум к получаемому изображению."},

	"Site may identify user by generating sound and reading it as a data. Different browsers and operating systems will do that operation with slightly different results. BAS allows to protect you by disallowing browser to obtain sound data or by adding custom noise to result." :{"ru": "Сайт может идентифицировать пользователя, генерируя звук и считывая его как массив данных. Различные браузеры и операционные системы будут выполнять эту операцию с немного разными результатами. BAS позволяет защитить вас, запретив браузеру получать звуковые данные или добавляя шум к этим данным."},

	"This setting is for debugging purposes only, the proper way to set is using" :{"ru": "Эта настройка находится здесь только для целей отладки, правильный метод добавления шума - использование сервиса"},
	"WebGl also may identify you among other users in pretty same ways as canvas." :{"ru": "WebGl также как и canvas позволяет идентифицировать вас среди других пользователей."},
	"WebGL vendor can expose your real hardware through javascript, so it is good idea to change it. Empty string will leave your real settings. This setting is for debugging purposes only, the proper way to set is using" :{"ru": "Через свойство WebGL vendor сайт может узнать характеристики вашего оборудования через javascript, так что имеет смысл менять это значение. Пустое поле оставит реальное значение. Эта настройка находится здесь только для целей отладки, правильный метод добавления шума - использование сервиса"},
	"WebGL renderer can expose your real hardware through javascript, so it is good idea to change it. Empty string will leave your real settings. This setting is for debugging purposes only, the proper way to set is using" :{"ru": "Через свойство WebGL renderer сайт может узнать характеристики вашего оборудования через javascript, так что имеет смысл менять это значение. Пустое поле оставит реальное значение. Эта настройка находится здесь только для целей отладки, правильный метод добавления шума - использование сервиса"},
	"Canvas noise pattern" :{"ru": "Шаблон шума canvas"},
	"WebGL noise pattern" :{"ru": "Шаблон шума WebGL"},
	"Network settings" :{"ru": "Сетевые настройки"},
	"Rendering settings" :{"ru": "Настройки отображения"},
	"Browsers smooth start" :{"ru": "Плавный запуск браузеров"},
	"You can set proxy through \"Proxy\" action." :{"ru": "Вы можете изменить прокси через действие \"Прокси\""},


	"Started without embedded languages.":{"ru": "Запущено без встроенных языков"},
	"Use process tunneling to enable proxy":{"ru": "Использовать туннелирование процесса для прокси"},
	"Disable webgl":{"ru": "Отключить webgl"},
	"Max browser start simultaneously":{"ru": "Максимальное количество браузеров запускаемых одновременно"},
	"Min free memory to start browser(mb)":{"ru": "Минимальное количество памяти для запуска браузера(в мб)"},
	"Min unused cpu to start browser(%)":{"ru": "Минимальное количество процессорного времени для запуска браузера(%)"},

	"Enable fingerprint detector":{"ru": "Включить fingerprint detector"},
	"FingerprintDetector addon helps to check if site that is opened with BAS uses browser fingerprint techniques to identify you among other users. This includes canvas, audio fingerprinting, font enumeration and many other. You will get detailed report for each fingerprinting activity as a result of its work. This tool can be useful if you want to check why your bot is being banned.":{"ru": "FingerprintDetector помогает собрать сведения, получает ли сайт отпечаток браузера, чтобы идентифицировать вас среди других пользователей. Это включает в себя методы идентификации по canvas, audio, перечисление шрифтов и многое многое другое. Этот инструмент может быть полезен, если вы хотите проверить, почему сайт обнаруживает активность ваших ботов."},
}


function tr(key)
{
	if(typeof(key) == "undefined")
	{

		var all = $(".tr")
		
		for(var i = 0;i< all.length;i++)
		{
			var el = $(all[i])
			if(typeof(el.attr("tr")) == "undefined" || el.attr("tr") != "true" )
			{
				el.html(tr(el.html()))
				el.attr("tr","true")
			}
		}

		all = $(".trtitle")
		
		for(var i = 0;i< all.length;i++)
		{
			var el = $(all[i])
			if(typeof(el.attr("tr")) == "undefined" || el.attr("tr") != "true" )
			{
				el.attr("title",tr(el.attr("title")))
				el.attr("tr","true")
			}
		}

		var all = $("*[placeholder]")
		
		for(var i = 0;i< all.length;i++)
		{
			var el = $(all[i])
			if(typeof(el.attr("tr")) == "undefined" || el.attr("tr") != "true" )
			{
				el.attr("placeholder",tr(el.attr("placeholder")))
				el.attr("tr","true")
			}
		}

		
		
		return;
	}

	
	if(typeof(_K) == "undefined" || _K == "en")
		return key;
	if(key in _L)
	{

		if(_K in _L[key])
		{
			return _L[key][_K]
		}
	}
	return key;
}