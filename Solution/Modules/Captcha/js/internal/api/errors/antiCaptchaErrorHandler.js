(function (api) {
  const errors = {
    ERROR_KEY_DOES_NOT_EXIST: {
      ru: "Авторизационный ключ не существует в системе или имеет неверный формат (длина не равняется 32 байтам).",
      en: "Account authorization key not found in the system."
    },
    ERROR_NO_SLOT_AVAILABLE: {
      ru: "Нет свободных работников в данный момент, попробуйте позже либо повысьте свою максимальную ставку.",
      en: "No idle captcha workers are available at the moment, please try a bit later or try increasing your maximum bid."
    },
    ERROR_ZERO_CAPTCHA_FILESIZE: {
      ru: "Размер капчи которую вы загружаете менее 100 байт.",
      en: "The size of the captcha you are uploading is less than 100 bytes."
    },
    ERROR_TOO_BIG_CAPTCHA_FILESIZE: {
      ru: "Размер капчи которую вы загружаете более 500,000 байт.",
      en: "The size of the captcha you are uploading is more than 500,000 bytes."
    },
    ERROR_ZERO_BALANCE: {
      ru: "Баланс учетной записи ниже нуля или равен нулю.",
      en: "Account has zeo or negative balance."
    },
    ERROR_IP_NOT_ALLOWED: {
      ru: "Запрос с этого IP адреса с текущим ключом отклонен.",
      en: "Request with current account key is not allowed from your IP."
    },
    ERROR_CAPTCHA_UNSOLVABLE: {
      ru: "5 разных работников не смогли разгадать капчу, задание остановлено.",
      en: "Captcha could not be solved by 5 different workers."
    },
    ERROR_BAD_DUPLICATES: {
      ru: "Не хватило заданного количества дублей капчи для функции 100% распознавания.",
      en: "100% recognition feature did not work due to lack of amount of guess attempts."
    },
    ERROR_NO_SUCH_METHOD: {
      ru: "Запрос в API выполнен на несуществующий метод.",
      en: "Request to API made with method which does not exist."
    },
    ERROR_IMAGE_TYPE_NOT_SUPPORTED: {
      ru: "Формат капчи не распознан по EXIF заголовку либо не поддерживается. Допустимые форматы: JPG, GIF, PNG.",
      en: "Could not determine captcha file type by its exif header or image type is not supported. The only allowed formats are JPG, GIF, PNG."
    },
    ERROR_NO_SUCH_CAPCHA_ID: {
      ru: "Капча с таким ID не была найдена в системе. Убедитесь что вы запрашиваете состояние капчи в течение 5 минут после загрузки.",
      en: "Captcha you are requesting does not exist in your current captchas list or has been expired. Captchas are removed from API after 5 minutes after upload."
    },
    ERROR_EMPTY_COMMENT: {
      ru: "Отсутствует комментарий в параметрах рекапчи версии API 1.",
      en: '"comment" property is required for this request.',
    },
    ERROR_IP_BLOCKED: {
      ru: "Доступ к API с этого IP запрещен из-за большого количества ошибок.",
      en: "Your IP is blocked due to API inproper use."
    },
    ERROR_TASK_ABSENT: {
      ru: "Отсутствует задача в методе createTask.",
      en: "Task property is empty or not set in createTask method. Please refer to API v2 documentation."
    },
    ERROR_TASK_NOT_SUPPORTED: {
      ru: "Тип задачи не поддерживается или указан не верно.",
      en: 'Task type is not supported or inproperly printed. Please check "type" parameter in task object.',
    },
    ERROR_INCORRECT_SESSION_DATA: {
      ru: "Неполные или некорректные данные об эмулируемом пользователе. Все требуемые поля не должны быть пустыми.",
      en: "Some of the required values for successive user emulation are missing."
    },
    ERROR_PROXY_CONNECT_REFUSED: {
      ru: "Не удалось подключиться к прокси-серверу - отказ в подключении.",
      en: "Could not connect to proxy related to the task, connection refused."
    },
    ERROR_PROXY_CONNECT_TIMEOUT: {
      ru: "Таймаут подключения к прокси-серверу.",
      en: "Could not connect to proxy related to the task, connection timeout."
    },
    ERROR_PROXY_READ_TIMEOUT: {
      ru: "Таймаут операции чтения прокси-сервера.",
      en: "Connection to proxy for task has timed out."
    },
    ERROR_PROXY_BANNED: {
      ru: "Прокси забанен на целевом сервисе капчи.",
      en: "Proxy IP is banned by target service."
    },
    ERROR_PROXY_TRANSPARENT: {
      ru: "Ошибка проверки прокси. Прокси должен быть не прозрачным, скрывать адрес конечного пользователя. В противном случае Google будет фильтровать запросы с IP нашего сервера.",
      en: "Task denied at proxy checking state. Proxy must be non-transparent to hide our server IP."
    },
    ERROR_RECAPTCHA_TIMEOUT: {
      ru: "Таймаут загрузки скрипта рекапчи, проблема либо в медленном прокси, либо в медленном сервере Google.",
      en: "Recaptcha task timeout, probably due to slow proxy server or Google server."
    },
    ERROR_RECAPTCHA_INVALID_SITEKEY: {
      ru: "Ошибка получаемая от сервера рекапчи. Неверный/невалидный sitekey.",
      en: "Recaptcha server reported that site key is invalid."
    },
    ERROR_RECAPTCHA_INVALID_DOMAIN: {
      ru: "Ошибка получаемая от сервера рекапчи. Домен не соответствует sitekey.",
      en: "Recaptcha server reported that domain for this site key is invalid."
    },
    ERROR_RECAPTCHA_OLD_BROWSER: {
      ru: "Для задачи используется User-Agent неподдерживаемого рекапчей браузера.",
      en: "Recaptcha server reported that browser user-agent is not compatible with their javascript."
    },
    ERROR_TOKEN_EXPIRED: {
      ru: "Провайдер капчи сообщил что дополнительный изменяющийся токен устарел. Попробуйте создать задачу еще раз с новым токеном.",
      en: "Captcha provider server reported that additional variable token has been expired. Please try again with new token."
    },
    ERROR_PROXY_HAS_NO_IMAGE_SUPPORT: {
      ru: "Прокси не поддерживает передачу изображений с серверов Google.",
      en: "Proxy does not support transfer of image data from Google servers."
    },
    ERROR_PROXY_INCOMPATIBLE_HTTP_VERSION: {
      ru: "Прокси не поддерживает длинные (длиной 2000 байт) GET запросы и не поддерживает SSL подключения.",
      en: "Proxy does not support long GET requests with length about 2000 bytes and does not support SSL connections."
    },
    ERROR_FACTORY_SERVER_API_CONNECTION_FAILED: {
      ru: "Не смогли подключиться к API сервера фабрики в течени 5 секунд.",
      en: "Could not connect to Factory Server API within 5 seconds."
    },
    ERROR_FACTORY_SERVER_BAD_JSON: {
      ru: "Неправильный JSON ответ фабрики, что-то сломалось.",
      en: "Incorrect Factory Server JSON response, something is broken."
    },
    ERROR_FACTORY_SERVER_ERRORID_MISSING: {
      ru: "API фабрики не вернул обязательное поле errorId.",
      en: "Factory Server API did not send any errorId."
    },
    ERROR_FACTORY_SERVER_ERRORID_NOT_ZERO: {
      ru: "Ожидали errorId = 0 в ответе API фабрики, получили другое значение.",
      en: "Factory Server API reported errorId != 0, check this error."
    },
    ERROR_FACTORY_MISSING_PROPERTY: {
      ru: "Значения некоторых требуемых полей в запросе к фабрике отсутствуют. Клиент должен прислать все требуемы поля.",
      en: "Some of the required property values are missing in Factory form specifications. Customer must send all required values."
    },
    ERROR_FACTORY_PROPERTY_INCORRECT_FORMAT: {
      ru: "Тип значения не соответствует ожидаемому в структуре задачи фабрики. Клиент должен прислать значение с требуемым типом.",
      en: "Expected other type of property value in Factory form structure. Customer must send specified value type."
    },
    ERROR_FACTORY_ACCESS_DENIED: {
      ru: "Доступ к управлению фабрикой принадлежит другой учетной записи. Проверьте свой ключ доступа.",
      en: "Factory control belong to another account, check your account key."
    },
    ERROR_FACTORY_SERVER_OPERATION_FAILED: {
      ru: "Общий код ошибки сервера фабрики.",
      en: "Factory Server general error code."
    },
    ERROR_FACTORY_PLATFORM_OPERATION_FAILED: {
      ru: "Общий код ошибки платформы.",
      en: "Factory Platform general error code."
    },
    ERROR_FACTORY_PROTOCOL_BROKEN: {
      ru: "Ошибка в протоколе во время выполнения задачи фабрики.",
      en: "Factory task lifetime protocol broken during task workflow."
    },
    ERROR_FACTORY_TASK_NOT_FOUND: {
      ru: "Задача не найдена или недоступна для этой операции.",
      en: "Task not found or not available for this operation."
    },
    ERROR_FACTORY_IS_SANDBOXED: {
      ru: "Фабрика находится в режиме песочницы, создание задач доступно только для владельца фабрики. Переведите фабрику в боевой режим, чтобы сделать ее доступной для всех клиентов.",
      en: "Factory is sandboxed, creating tasks is possible only by Factory owner. Switch it to production mode to make it available for other customers."
    },
    ERROR_PROXY_NOT_AUTHORISED: {
      ru: "Заданы неверные логин и пароль для прокси.",
      en: "Proxy login and password are incorrect."
    },
    ERROR_FUNCAPTCHA_NOT_ALLOWED: {
      ru: "Заказчик не включил тип задач Funcaptcha Proxyless в панели клиентов - Настройки API. Все заказчики должны прочитать условия, пройти мини тест и подписать/принять форму до того как смогут использовать данный тип задач.",
      en: "Customer did not enable Funcaptcha Proxyless tasks in Customers Area - API Settings. All customers must read terms, pass mini test and sign/accept the form before being able to use this feature."
    },
    ERROR_INVISIBLE_RECAPTCHA: {
      ru: "Обнаружена попытка решить невидимую рекапчу в обычном режиме. В случае возникновения этой ошибки вам ничего не нужно предпринимать, наша система через некоторое время начнет решать задачи с этим ключом в невидимом режиме. Просто шлите еще задачи с тем же ключом и доменом.",
      en: "Recaptcha was attempted to be solved as usual one, instead of invisible mode. Basically you don't need to do anything when this error occurs, just continue sending tasks with this domain. Our system will self-learn to solve recaptchas from this sitekey in invisible mode."
    },
    ERROR_FAILED_LOADING_WIDGET: {
      ru: "Не удалось загрузить виджет капчи в браузере работника. Попробуйте прислать новую задачу.",
      en: "Could not load captcha provider widget in worker browser. Please try sending new task."
    },
    ERROR_VISIBLE_RECAPTCHA: {
      ru: "Был передан флаг, что рекапча невидимая (v2), но на самом деле она видимая",
      en: "Visible (v2) recaptcha was attempted to solved as invisible (v2)"
    },
    ERROR_ALL_WORKERS_FILTERED: {
      ru: "Не осталось работников, которые не были бы отфильтрованы методом reportIncorrectRecaptcha.",
      en: "No workers left which were not filtered by reportIncorrectRecaptcha method."
    }
  };

  api.prototype.errorHandler = function (response) {
    if (response && response['errorCode']) {
      const errorCode = response['errorCode'];
      if (errors[errorCode]) return fail(errors[errorCode][_K]);
      return fail('Captcha solving error: ' + errorCode);
    }
    return response;
  };
})(BASCaptchaSolver.AntiCaptchaApi);
