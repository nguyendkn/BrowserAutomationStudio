BASCaptchaSolver.ErrorHandler = function (error, error_text) {
  if (error == "16" || error == 16) {
    error = error_text;
  }

  if (BASCaptchaSolver.api.apiType === 'antiCaptcha') {
    var errors = {
      ERROR_KEY_DOES_NOT_EXIST: {
        ru:
          "Авторизационный ключ не существует в системе или имеет неверный формат (длина не равняется 32 байтам).",
        en: "Account authorization key not found in the system.",
        action: "die",
        instantly: true,
      },
      ERROR_NO_SLOT_AVAILABLE: {
        ru:
          "Нет свободных работников в данный момент, попробуйте позже либо повысьте свою максимальную ставку.",
        en:
          "No idle captcha workers are available at the moment, please try a bit later or try increasing your maximum bid.",
        action: "fail",
        stop: false,
      },
      ERROR_ZERO_CAPTCHA_FILESIZE: {
        ru: "Размер капчи которую вы загружаете менее 100 байт.",
        en: "The size of the captcha you are uploading is less than 100 bytes.",
        action: "fail",
        stop: false,
      },
      ERROR_TOO_BIG_CAPTCHA_FILESIZE: {
        ru: "Размер капчи которую вы загружаете более 500,000 байт.",
        en:
          "The size of the captcha you are uploading is more than 500,000 bytes.",
        action: "fail",
        stop: false,
      },
      ERROR_ZERO_BALANCE: {
        ru: "Баланс учетной записи ниже нуля или равен нулю.",
        en: "Account has zeo or negative balance.",
        action: "die",
        instantly: false,
      },
      ERROR_IP_NOT_ALLOWED: {
        ru: "Запрос с этого IP адреса с текущим ключом отклонен.",
        en: "Request with current account key is not allowed from your IP.",
        action: "die",
        instantly: false,
      },
      ERROR_CAPTCHA_UNSOLVABLE: {
        ru:
          "5 разных работников не смогли разгадать капчу, задание остановлено.",
        en: "Captcha could not be solved by 5 different workers.",
        action: "fail",
        stop: false,
      },
      ERROR_BAD_DUPLICATES: {
        ru:
          "Не хватило заданного количества дублей капчи для функции 100% распознавания.",
        en:
          "100% recognition feature did not work due to lack of amount of guess attempts.",
        action: "fail",
        stop: false,
      },
      ERROR_NO_SUCH_METHOD: {
        ru: "Запрос в API выполнен на несуществующий метод.",
        en: "Request to API made with method which does not exist.",
        action: "die",
        instantly: true,
      },
      ERROR_IMAGE_TYPE_NOT_SUPPORTED: {
        ru:
          "Формат капчи не распознан по EXIF заголовку либо не поддерживается. Допустимые форматы: JPG, GIF, PNG.",
        en:
          "Could not determine captcha file type by its exif header or image type is not supported. The only allowed formats are JPG, GIF, PNG.",
        action: "die",
        instantly: true,
      },
      ERROR_NO_SUCH_CAPCHA_ID: {
        ru:
          "Капча с таким ID не была найдена в системе. Убедитесь что вы запрашиваете состояние капчи в течение 5 минут после загрузки.",
        en:
          "Captcha you are requesting does not exist in your current captchas list or has been expired. Captchas are removed from API after 5 minutes after upload.",
        action: "fail",
        stop: false,
      },
      ERROR_EMPTY_COMMENT: {
        ru: "Отсутствует комментарий в параметрах рекапчи версии API 1.",
        en: '"comment" property is required for this request.',
        action: "die",
        instantly: true,
      },
      ERROR_IP_BLOCKED: {
        ru:
          "Доступ к API с этого IP запрещен из-за большого количества ошибок.",
        en: "Your IP is blocked due to API inproper use.",
        action: "die",
        instantly: true,
      },
      ERROR_TASK_ABSENT: {
        ru: "Отсутствует задача в методе createTask.",
        en:
          "Task property is empty or not set in createTask method. Please refer to API v2 documentation.",
        action: "die",
        instantly: true,
      },
      ERROR_TASK_NOT_SUPPORTED: {
        ru: "Тип задачи не поддерживается или указан не верно.",
        en:
          'Task type is not supported or inproperly printed. Please check "type" parameter in task object.',
        action: "die",
        instantly: true,
      },
      ERROR_INCORRECT_SESSION_DATA: {
        ru:
          "Неполные или некорректные данные об эмулируемом пользователе. Все требуемые поля не должны быть пустыми.",
        en:
          "Some of the required values for successive user emulation are missing.",
        action: "die",
        instantly: true,
      },
      ERROR_PROXY_CONNECT_REFUSED: {
        ru: "Не удалось подключиться к прокси-серверу - отказ в подключении.",
        en:
          "Could not connect to proxy related to the task, connection refused.",
        action: "fail",
        stop: false,
      },
      ERROR_PROXY_CONNECT_TIMEOUT: {
        ru: "Таймаут подключения к прокси-серверу.",
        en:
          "Could not connect to proxy related to the task, connection timeout.",
        action: "fail",
        stop: false,
      },
      ERROR_PROXY_READ_TIMEOUT: {
        ru: "Таймаут операции чтения прокси-сервера.",
        en: "Connection to proxy for task has timed out.",
        action: "fail",
        stop: false,
      },
      ERROR_PROXY_BANNED: {
        ru: "Прокси забанен на целевом сервисе капчи.",
        en: "Proxy IP is banned by target service.",
        action: "fail",
        stop: false,
      },
      ERROR_PROXY_TRANSPARENT: {
        ru:
          "Ошибка проверки прокси. Прокси должен быть не прозрачным, скрывать адрес конечного пользователя. В противном случае Google будет фильтровать запросы с IP нашего сервера.",
        en:
          "Task denied at proxy checking state. Proxy must be non-transparent to hide our server IP.",
        action: "fail",
        stop: false,
      },
      ERROR_RECAPTCHA_TIMEOUT: {
        ru:
          "Таймаут загрузки скрипта рекапчи, проблема либо в медленном прокси, либо в медленном сервере Google.",
        en:
          "Recaptcha task timeout, probably due to slow proxy server or Google server.",
        action: "fail",
        stop: false,
      },
      ERROR_RECAPTCHA_INVALID_SITEKEY: {
        ru:
          "Ошибка получаемая от сервера рекапчи. Неверный/невалидный sitekey.",
        en: "Recaptcha server reported that site key is invalid.",
        action: "die",
        instantly: true,
      },
      ERROR_RECAPTCHA_INVALID_DOMAIN: {
        ru:
          "Ошибка получаемая от сервера рекапчи. Домен не соответствует sitekey.",
        en:
          "Recaptcha server reported that domain for this site key is invalid.",
        action: "die",
        instantly: true,
      },
      ERROR_RECAPTCHA_OLD_BROWSER: {
        ru:
          "Для задачи используется User-Agent неподдерживаемого рекапчей браузера.",
        en:
          "Recaptcha server reported that browser user-agent is not compatible with their javascript.",
        action: "fail",
        stop: false,
      },
      ERROR_TOKEN_EXPIRED: {
        ru:
          "Провайдер капчи сообщил что дополнительный изменяющийся токен устарел. Попробуйте создать задачу еще раз с новым токеном.",
        en:
          "Captcha provider server reported that additional variable token has been expired. Please try again with new token.",
        action: "fail",
        stop: false,
      },
      ERROR_PROXY_HAS_NO_IMAGE_SUPPORT: {
        ru: "Прокси не поддерживает передачу изображений с серверов Google.",
        en:
          "Proxy does not support transfer of image data from Google servers.",
        action: "fail",
        stop: false,
      },
      ERROR_PROXY_INCOMPATIBLE_HTTP_VERSION: {
        ru:
          "Прокси не поддерживает длинные (длиной 2000 байт) GET запросы и не поддерживает SSL подключения.",
        en:
          "Proxy does not support long GET requests with length about 2000 bytes and does not support SSL connections.",
        action: "fail",
        stop: false,
      },
      ERROR_FACTORY_SERVER_API_CONNECTION_FAILED: {
        ru: "Не смогли подключиться к API сервера фабрики в течени 5 секунд.",
        en: "Could not connect to Factory Server API within 5 seconds.",
        action: "fail",
        stop: false,
      },
      ERROR_FACTORY_SERVER_BAD_JSON: {
        ru: "Неправильный JSON ответ фабрики, что-то сломалось.",
        en: "Incorrect Factory Server JSON response, something is broken.",
        action: "die",
        instantly: true,
      },
      ERROR_FACTORY_SERVER_ERRORID_MISSING: {
        ru: "API фабрики не вернул обязательное поле errorId.",
        en: "Factory Server API did not send any errorId.",
        action: "die",
        instantly: true,
      },
      ERROR_FACTORY_SERVER_ERRORID_NOT_ZERO: {
        ru:
          "Ожидали errorId = 0 в ответе API фабрики, получили другое значение.",
        en: "Factory Server API reported errorId != 0, check this error.",
        action: "die",
        instantly: true,
      },
      ERROR_FACTORY_MISSING_PROPERTY: {
        ru:
          "Значения некоторых требуемых полей в запросе к фабрике отсутствуют. Клиент должен прислать все требуемы поля.",
        en:
          "Some of the required property values are missing in Factory form specifications. Customer must send all required values.",
        action: "die",
        instantly: true,
      },
      ERROR_FACTORY_PROPERTY_INCORRECT_FORMAT: {
        ru:
          "Тип значения не соответствует ожидаемому в структуре задачи фабрики. Клиент должен прислать значение с требуемым типом.",
        en:
          "Expected other type of property value in Factory form structure. Customer must send specified value type.",
        action: "die",
        instantly: true,
      },
      ERROR_FACTORY_ACCESS_DENIED: {
        ru:
          "Доступ к управлению фабрикой принадлежит другой учетной записи. Проверьте свой ключ доступа.",
        en:
          "Factory control belong to another account, check your account key.",
        action: "die",
        instantly: true,
      },
      ERROR_FACTORY_SERVER_OPERATION_FAILED: {
        ru: "Общий код ошибки сервера фабрики.",
        en: "Factory Server general error code.",
        action: "fail",
        stop: false,
      },
      ERROR_FACTORY_PLATFORM_OPERATION_FAILED: {
        ru: "Общий код ошибки платформы.",
        en: "Factory Platform general error code.",
        action: "fail",
        stop: false,
      },
      ERROR_FACTORY_PROTOCOL_BROKEN: {
        ru: "Ошибка в протоколе во время выполнения задачи фабрики.",
        en: "Factory task lifetime protocol broken during task workflow.",
        action: "fail",
        stop: false,
      },
      ERROR_FACTORY_TASK_NOT_FOUND: {
        ru: "Задача не найдена или недоступна для этой операции.",
        en: "Task not found or not available for this operation.",
        action: "fail",
        stop: false,
      },
      ERROR_FACTORY_IS_SANDBOXED: {
        ru:
          "Фабрика находится в режиме песочницы, создание задач доступно только для владельца фабрики. Переведите фабрику в боевой режим, чтобы сделать ее доступной для всех клиентов.",
        en:
          "Factory is sandboxed, creating tasks is possible only by Factory owner. Switch it to production mode to make it available for other customers.",
        action: "fail",
        stop: false,
      },
      ERROR_PROXY_NOT_AUTHORISED: {
        ru: "Заданы неверные логин и пароль для прокси.",
        en: "Proxy login and password are incorrect.",
        action: "fail",
        stop: false,
      },
      ERROR_FUNCAPTCHA_NOT_ALLOWED: {
        ru:
          "Заказчик не включил тип задач Funcaptcha Proxyless в панели клиентов - Настройки API. Все заказчики должны прочитать условия, пройти мини тест и подписать/принять форму до того как смогут использовать данный тип задач.",
        en:
          "Customer did not enable Funcaptcha Proxyless tasks in Customers Area - API Settings. All customers must read terms, pass mini test and sign/accept the form before being able to use this feature.",
        action: "die",
        instantly: true,
      },
      ERROR_INVISIBLE_RECAPTCHA: {
        ru:
          "Обнаружена попытка решить невидимую рекапчу в обычном режиме. В случае возникновения этой ошибки вам ничего не нужно предпринимать, наша система через некоторое время начнет решать задачи с этим ключом в невидимом режиме. Просто шлите еще задачи с тем же ключом и доменом.",
        en:
          "Recaptcha was attempted to be solved as usual one, instead of invisible mode. Basically you don't need to do anything when this error occurs, just continue sending tasks with this domain. Our system will self-learn to solve recaptchas from this sitekey in invisible mode.",
        action: "fail",
        stop: false,
      },
      ERROR_FAILED_LOADING_WIDGET: {
        ru:
          "Не удалось загрузить виджет капчи в браузере работника. Попробуйте прислать новую задачу.",
        en:
          "Could not load captcha provider widget in worker browser. Please try sending new task.",
        action: "fail",
        stop: false,
      },
    };
  }

  if (BASCaptchaSolver.api.apiType === 'ruCaptcha') {
    var errors = {
      ERROR_WRONG_USER_KEY: {
        ru:
          "Вы указали значение параметра key в неверном формате, ключ должен содержать 32 символа.",
        en:
          "You've provided key parameter value in incorrect format, it should contain 32 symbols.",
        action: "die",
        instantly: true,
      },
      ERROR_KEY_DOES_NOT_EXIST: {
        ru: "Ключ, который вы указали, не существует.",
        en: "The key you've provided does not exists.",
        action: "die",
        instantly: true,
      },
      ERROR_ZERO_BALANCE: {
        ru: "На вашем счету недостаточно средств.",
        en: "You don't have funds on your account.",
        action: "die",
        instantly: false,
      },
      ERROR_PAGEURL: {
        ru: "Параметр pageurl не задан в запросе.",
        en: "pageurl parameter is missing in your request.",
        action: "die",
        instantly: true,
      },
      ERROR_NO_SLOT_AVAILABLE: {
        ru:
          "Очередь ваших капч, которые ещё не распределены на работников, слишком длинная. Или максимальная ставка, которую вы указали в настройках аккаунта ниже текущей ставки на сервере.",
        en:
          "The queue of your captchas that are not distributed to workers is too long. Or your maximum rate that you specified in account settings is lower than current rate on the server.",
        action: "fail",
        stop: false,
      },
      ERROR_ZERO_CAPTCHA_FILESIZE: {
        ru: "Размер вашего изображения менее 100 байт.",
        en: "Image size is less than 100 bytes.",
        action: "die",
        instantly: true,
      },
      ERROR_TOO_BIG_CAPTCHA_FILESIZE: {
        ru: "Размер вашего изображения более 100 Кбайт.",
        en: "Image size is more than 100 kB.",
        action: "die",
        instantly: true,
      },
      ERROR_WRONG_FILE_EXTENSION: {
        ru:
          "Файл имеет неподдерживаемое расширение. Допустимые расширения: jpg, jpeg, gif, png.",
        en:
          "Image file has unsupported extension. Accepted extensions: jpg, jpeg, gif, png.",
        action: "die",
        instantly: true,
      },
      ERROR_IMAGE_TYPE_NOT_SUPPORTED: {
        ru: "Сервер не может опознать тип вашего файла.",
        en: "Server can't recognize image file type.",
        action: "die",
        instantly: true,
      },
      ERROR_UPLOAD: {
        ru:
          "Сервер не может прочитать файл из вашего POST-запроса.Это происходит, если POST-запрос некорректно сформирован в части отправки файла, либо содержит невалидный base64.",
        en:
          "Server can't get file data from your POST-request.That happens if your POST-request is malformed or base64 data is not a valid base64 image.",
        action: "die",
        instantly: true,
      },
      ERROR_IP_NOT_ALLOWED: {
        ru:
          "Запрос отправлен с IP-адреса, который не добавлен в список разрешённых вами IP-адресов.",
        en:
          "The request is sent from the IP that is not on the list of your allowed IPs.",
        action: "die",
        instantly: true,
      },
      IP_BANNED: {
        ru:
          "Ваш IP-адрес заблокирован за чрезмерное количество попыток авторизации с неверным ключем авторизации.",
        en:
          "Your IP address is banned due to many frequent attempts to access the server using wrong authorization keys.",
        action: "die",
        instantly: true,
      },
      ERROR_BAD_TOKEN_OR_PAGEURL: {
        ru:
          "Параметры pageurl и sitekey не заданы или имеют некорректный формат.",
        en: "pageurl and sitekey parameters is missing or incorrect.",
        action: "die",
        instantly: true,
      },
      ERROR_GOOGLEKEY: {
        ru: "Параметр sitekey не задан или имеет некорректный формат.",
        en: "sitekey parameter is missing or invalid format.",
        action: "die",
        instantly: true,
      },
      ERROR_CAPTCHAIMAGE_BLOCKED: {
        ru:
          "Вы отправили изображение, которые помечено в нашей базе данных как нераспознаваемое. Обычно это происходит, если сайт, на котором вы решаете капчу, прекратил отдавать вам капчу и вместо этого выдает изображение с информацией о блокировке.",
        en:
          'You\'ve sent an image that is marked in our database as unrecognizable. Usually that happens if the website where you found the captcha stopped sending you captchas and started to send "deny access" image.',
        action: "die",
        instantly: true,
      },
      MAX_USER_TURN: {
        ru:
          "Вы делаете больше 60 обращений к in.php в течение 3 секунд. Ваш ключ API заблокирован на 10 секунд. Блокировка будет снята автоматически.",
        en:
          "You made more than 60 requests to in.php within 3 seconds. Your account is banned for 10 seconds. Ban will be lifted automatically.",
        action: "die",
        instantly: false,
      },
      ERROR_BAD_PARAMETERS: {
        ru:
          "Параметры для разгадывания капчи не заданы или имеют некорректный формат.",
        en: "Parameters for solving captcha is missing or incorrect.",
        action: "die",
        instantly: true,
      },
      ERROR_BAD_PROXY: {
        ru:
          "Вы можете получить эту ошибку, если ваш прокси-сервер был помечен ПЛОХИМ, т.к. нам не удалось к нему подключиться.",
        en:
          "You can get this error code when sending a captcha via proxy server which is marked as BAD by our API.",
        action: "fail",
        stop: false,
      },
      CAPCHA_NOT_READY: {
        ru: "Ваша капча ещё не решена.",
        en: "Your captcha is not solved yet.",
        action: "fail",
        stop: false,
      },
      ERROR_CAPTCHA_UNSOLVABLE: {
        ru:
          "Мы не можем решить вашу капчу — три наших работника не смогли её решить, либо мы не получили ответ в течение 90 секунд. Мы не спишем с вас деньги за этот запрос.",
        en:
          "We are unable to solve your captcha - three of our workers were unable solve it or we didn't get an answer within 90 seconds (300 seconds for ReCaptcha V2). We will not charge you for that request.",
        action: "fail",
        stop: false,
      },
      ERROR_WRONG_ID_FORMAT: {
        ru:
          "Вы отправили ID капчи в неправильном формате. ID состоит только из цифр.",
        en:
          "You've provided captcha ID in wrong format. The ID can contain numbers only.",
        action: "fail",
        stop: false,
      },
      ERROR_WRONG_CAPTCHA_ID: {
        ru: "Вы отправили неверный ID капчи.",
        en: "You've provided incorrect captcha ID.",
        action: "fail",
        stop: false,
      },
      ERROR_BAD_DUPLICATES: {
        ru:
          "Ошибка возвращается, если вы используете функцию 100% распознавания. Ошибка означает, что мы достигли максимального числа попыток, но требуемое количество совпадений достигнуто не было.",
        en:
          "Error is returned when 100% accuracy feature is enabled. The error means that max numbers of tries is reached but min number of matches not found.",
        action: "fail",
        stop: false,
      },
      REPORT_NOT_RECORDED: {
        ru:
          "Ошибка возвращается при отправке жалобы на неверный ответ если вы уже пожаловались на большое количество верно решённых капч (более 40%). Или если прошло более 15 минут с момента отправки капчи на решение.",
        en:
          "Error is returned to your complain request if you already complained lots of correctly solved captchas (more than 40%). Or if more than 15 minutes passed after you submitted the captcha.",
        action: "fail",
        stop: false,
      },
      ERROR_IP_ADDRES: {
        ru:
          "Ошибка возвращается при добавлении домена или IP для pingback (callback). Это происходит, если вы отправляете запрос на добавление IP или домена с IP адреса, не совпадающего с вашим IP или доменом для pingback.",
        en:
          "You can receive this error code when registering a pingback (callback) IP or domain. That happes if your request is coming from an IP address that doesn't match the IP address of your pingback IP or domain.",
        action: "die",
        instantly: true,
      },
      ERROR_TOKEN_EXPIRED: {
        ru:
          "Вы можете получить эту ошибку, если решаете капчу GeeTest. Этот код ошибки означает, что истек срок действия значения challenge из вашего запроса.",
        en:
          "You can receive this error code when sending GeeTest. That error means that challenge value you provided is expired.",
        action: "fail",
        stop: false,
      },
      ERROR_EMPTY_ACTION: {
        ru: "Параметр action не задан или имеет некорректный формат.",
        en: "action parameter is missing or incorrect.",
        action: "die",
        instantly: true,
      },
      ERROR_PROXY_CONNECTION_FAILED: {
        ru:
          "Вы можете получить эту ошибку, если нам не удалось загрузить капчу через ваш прокси-сервер. Этот прокси будет помечен ПЛОХИМ и мы не будем принимать запросы с ним в течении 10 минут. А in.php будет возвращать ошибку ERROR_BAD_PROXY при использовании этого прокси.",
        en:
          "You can get this error code if we were unable to load a captcha through your proxy server. The proxy will be marked as BAD by our API and we will not accept requests with the proxy during 10 minutes. You will recieve ERROR_BAD_PROXY code from in.php API endpoint in such case.",
        action: "fail",
        stop: false,
      },
    };
  }

  if (errors[error]) {
    const message = BASCaptchaSolver.api.name + ': ' + error + ' - ' + errors[error][_K];

    if (errors[error].action === 'fail') {
      fail_user(message, errors[error]['stop']);
    } else {
      die(message, errors[error]['instantly']);
    }
  } else {
    if (error === error_text || !error_text) {
      fail_user(BASCaptchaSolver.api.name + ': ' + error + ".", false);
    } else {
      fail_user(
        BASCaptchaSolver.api.name + ': ' + error + ', ' + error_text + '.',
        false
      );
    }
  }
};
