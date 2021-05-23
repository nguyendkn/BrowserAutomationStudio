(function (api) {
  const errors = {
    ERROR_WRONG_USER_KEY: {
      ru: "Вы указали значение параметра key в неверном формате, ключ должен содержать 32 символа.",
      en: "You've provided key parameter value in incorrect format, it should contain 32 symbols.",
    },
    ERROR_KEY_DOES_NOT_EXIST: {
      ru: "Ключ, который вы указали, не существует.",
      en: "The key you've provided does not exists.",
    },
    ERROR_ZERO_BALANCE: {
      ru: "На вашем счету недостаточно средств.",
      en: "You don't have funds on your account.",
    },
    ERROR_PAGEURL: {
      ru: "Параметр pageurl не задан в запросе.",
      en: "pageurl parameter is missing in your request.",
    },
    ERROR_NO_SLOT_AVAILABLE: {
      ru: "Очередь ваших капч, которые ещё не распределены на работников, слишком длинная. Или максимальная ставка, которую вы указали в настройках аккаунта ниже текущей ставки на сервере.",
      en: "The queue of your captchas that are not distributed to workers is too long. Or your maximum rate that you specified in account settings is lower than current rate on the server.",
    },
    ERROR_ZERO_CAPTCHA_FILESIZE: {
      ru: "Размер вашего изображения менее 100 байт.",
      en: "Image size is less than 100 bytes.",
    },
    ERROR_TOO_BIG_CAPTCHA_FILESIZE: {
      ru: "Размер вашего изображения более 100 Кбайт.",
      en: "Image size is more than 100 kB.",
    },
    ERROR_WRONG_FILE_EXTENSION: {
      ru: "Файл имеет неподдерживаемое расширение. Допустимые расширения: jpg, jpeg, gif, png.",
      en: "Image file has unsupported extension. Accepted extensions: jpg, jpeg, gif, png.",
    },
    ERROR_IMAGE_TYPE_NOT_SUPPORTED: {
      ru: "Сервер не может опознать тип вашего файла.",
      en: "Server can't recognize image file type.",
    },
    ERROR_UPLOAD: {
      ru: "Сервер не может прочитать файл из вашего POST-запроса.Это происходит, если POST-запрос некорректно сформирован в части отправки файла, либо содержит невалидный base64.",
      en: "Server can't get file data from your POST-request.That happens if your POST-request is malformed or base64 data is not a valid base64 image.",
    },
    ERROR_IP_NOT_ALLOWED: {
      ru: "Запрос отправлен с IP-адреса, который не добавлен в список разрешённых вами IP-адресов.",
      en: "The request is sent from the IP that is not on the list of your allowed IPs.",
    },
    IP_BANNED: {
      ru: "Ваш IP-адрес заблокирован за чрезмерное количество попыток авторизации с неверным ключем авторизации.",
      en: "Your IP address is banned due to many frequent attempts to access the server using wrong authorization keys.",
    },
    ERROR_BAD_TOKEN_OR_PAGEURL: {
      ru: "Параметры pageurl и sitekey не заданы или имеют некорректный формат.",
      en: "pageurl and sitekey parameters is missing or incorrect.",
    },
    ERROR_GOOGLEKEY: {
      ru: "Параметр sitekey не задан или имеет некорректный формат.",
      en: "sitekey parameter is missing or invalid format.",
    },
    ERROR_CAPTCHAIMAGE_BLOCKED: {
      ru: "Вы отправили изображение, которые помечено в нашей базе данных как нераспознаваемое. Обычно это происходит, если сайт, на котором вы решаете капчу, прекратил отдавать вам капчу и вместо этого выдает изображение с информацией о блокировке.",
      en: 'You\'ve sent an image that is marked in our database as unrecognizable. Usually that happens if the website where you found the captcha stopped sending you captchas and started to send "deny access" image.',
    },
    MAX_USER_TURN: {
      ru: "Вы делаете больше 60 обращений к in.php в течение 3 секунд. Ваш ключ API заблокирован на 10 секунд. Блокировка будет снята автоматически.",
      en: "You made more than 60 requests to in.php within 3 seconds. Your account is banned for 10 seconds. Ban will be lifted automatically.",
    },
    ERROR_BAD_PARAMETERS: {
      ru: "Параметры для разгадывания капчи не заданы или имеют некорректный формат.",
      en: "Parameters for solving captcha is missing or incorrect.",
    },
    ERROR_BAD_PROXY: {
      ru: "Вы можете получить эту ошибку, если ваш прокси-сервер был помечен ПЛОХИМ, т.к. нам не удалось к нему подключиться.",
      en: "You can get this error code when sending a captcha via proxy server which is marked as BAD by our API.",
    },
    CAPCHA_NOT_READY: {
      ru: "Ваша капча ещё не решена.",
      en: "Your captcha is not solved yet.",
    },
    ERROR_CAPTCHA_UNSOLVABLE: {
      ru: "Мы не можем решить вашу капчу — три наших работника не смогли её решить, либо мы не получили ответ в течение 90 секунд. Мы не спишем с вас деньги за этот запрос.",
      en: "We are unable to solve your captcha - three of our workers were unable solve it or we didn't get an answer within 90 seconds (300 seconds for ReCaptcha V2). We will not charge you for that request.",
    },
    ERROR_WRONG_ID_FORMAT: {
      ru: "Вы отправили ID капчи в неправильном формате. ID состоит только из цифр.",
      en: "You've provided captcha ID in wrong format. The ID can contain numbers only.",
    },
    ERROR_WRONG_CAPTCHA_ID: {
      ru: "Вы отправили неверный ID капчи.",
      en: "You've provided incorrect captcha ID.",
    },
    ERROR_BAD_DUPLICATES: {
      ru: "Ошибка возвращается, если вы используете функцию 100% распознавания. Ошибка означает, что мы достигли максимального числа попыток, но требуемое количество совпадений достигнуто не было.",
      en: "Error is returned when 100% accuracy feature is enabled. The error means that max numbers of tries is reached but min number of matches not found.",
    },
    REPORT_NOT_RECORDED: {
      ru: "Ошибка возвращается при отправке жалобы на неверный ответ если вы уже пожаловались на большое количество верно решённых капч (более 40%). Или если прошло более 15 минут с момента отправки капчи на решение.",
      en: "Error is returned to your complain request if you already complained lots of correctly solved captchas (more than 40%). Or if more than 15 minutes passed after you submitted the captcha.",
    },
    ERROR_IP_ADDRES: {
      ru: "Ошибка возвращается при добавлении домена или IP для pingback (callback). Это происходит, если вы отправляете запрос на добавление IP или домена с IP адреса, не совпадающего с вашим IP или доменом для pingback.",
      en: "You can receive this error code when registering a pingback (callback) IP or domain. That happes if your request is coming from an IP address that doesn't match the IP address of your pingback IP or domain.",
    },
    ERROR_TOKEN_EXPIRED: {
      ru: "Вы можете получить эту ошибку, если решаете капчу GeeTest. Этот код ошибки означает, что истек срок действия значения challenge из вашего запроса.",
      en: "You can receive this error code when sending GeeTest. That error means that challenge value you provided is expired.",
    },
    ERROR_EMPTY_ACTION: {
      ru: "Параметр action не задан или имеет некорректный формат.",
      en: "action parameter is missing or incorrect.",
    },
    ERROR_PROXY_CONNECTION_FAILED: {
      ru: "Вы можете получить эту ошибку, если нам не удалось загрузить капчу через ваш прокси-сервер. Этот прокси будет помечен ПЛОХИМ и мы не будем принимать запросы с ним в течении 10 минут. А in.php будет возвращать ошибку ERROR_BAD_PROXY при использовании этого прокси.",
      en: "You can get this error code if we were unable to load a captcha through your proxy server. The proxy will be marked as BAD by our API and we will not accept requests with the proxy during 10 minutes. You will recieve ERROR_BAD_PROXY code from in.php API endpoint in such case.",
    },
  };

  api.prototype.errorHandler = function (response) {
    if (response && (response['status'] === 0 && response['request'] !== 'CAPCHA_NOT_READY')) {
      const errorCode = response['request'];
      if (errors[errorCode]) return fail(errors[errorCode][_K]);
      return fail('Captcha solving error: ' + errorCode);
    }
    return response;
  };
})(BASCaptchaSolver.RuCaptchaApi);
