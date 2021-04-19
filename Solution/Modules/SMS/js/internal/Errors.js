_SMS.base.prototype.errorHandler = function(error, errorText){
	error = error.toString();
	errorText = _avoid_nilb(errorText, "").toString();
	var errors = {
		"FAILED_REQUEST": {
			"ru": "Не удалось успешно выполнить запрос к сервису за 10 попыток.",
			"en": "Failed to successfully complete the request to the service in 10 attempts.",
			"action": "fail"
		},
		"RESPONSE_IS_NOT_JSON": {
			"ru": "Не удалось распарсить ответ от сервиса. Содержание ответа: " + errorText,
			"en": "Failed to parse the response from the service. Response content: " + errorText,
			"action": "fail"
		},
		"TIMEOUT_GET_STATE": {
			"ru": "Превышено время ожидания выполнения действия getState.",
			"en": "Timed out for execution of an action getState.",
			"action": "fail"
		},
		
		/* sms-activate */
		
		"BAD_KEY": {
			"ru": "Неверный API-ключ.",
			"en": "Invalid API key.",
			"action": "die",
			"instantly": true
		},
		"NO_BALANCE": {
			"ru": "Закончился баланс.",
			"en": "Balance ended.",
			"action": "die",
			"instantly": false
		},
		"NO_MEANS": {
			"ru": "Закончился баланс.",
			"en": "Balance ended.",
			"action": "die",
			"instantly": false
		},
		"NO_NUMBERS": {
			"ru": "Нет номеров.",
			"en": "No numbers.",
			"action": "fail"
		},
		"ERROR_SQL": {
			"ru": "Ошибка SQL-сервера.",
			"en": "SQL Server Error.",
			"action": "fail"
		},
		"BAD_ACTION": {
			"ru": "Некорректное действие.",
			"en": "Incorrect action.",
			"action": "fail"
		},
		"BAD_SERVICE": {
			"ru": "Некорректное наименование сервиса.",
			"en": "Incorrect service name.",
			"action": "fail"
		},
		"WRONG_SERVICE": {
			"ru": "Неверный идентификатор сервиса.",
			"en": "Invalid service identifier.",
			"action": "fail"
		},
		"WRONG_EXCEPTION_PHONE": {
			"ru": "Некорректные исключающие префиксы.",
			"en": "Invalid exclusion prefixes.",
			"action": "fail"
		},
		"NO_BALANCE_FORWARD": {
			"ru": "Недостаточно средств для покупки переадресации.",
			"en": "Iinsufficient funds to buy call forwarding.",
			"action": "die",
			"instantly": false
		},
		"BAD_FORWARD": {
			"ru": "Некорректно указана переадресация.",
			"en": "Redirection specified incorrectly.",
			"action": "fail"
		},
		"NOT_AVAILABLE": {
			"ru": "Для страны, которую вы используете, недоступна покупка мультисервисов.",
			"en": "Multiservice purchase is not available for the country you are using.",
			"action": "fail"
		},
		"NO_ACTIVATION": {
			"ru": "id активации не существует.",
			"en": "Activation id does not exist.",
			"action": "fail"
		},
		"WRONG_ADDITIONAL_SERVICE": {
			"ru": "Неверный дополнительный сервис (допустимы только сервисы для переадресации).",
			"en": "Invalid additional service (only services for redirection are allowed).",
			"action": "fail"
		},
		"WRONG_ACTIVATION_ID": {
			"ru": "Неверный ID родительской активации.",
			"en": "Invalid Parent Activation ID.",
			"action": "fail"
		},
		"WRONG_SECURITY": {
			"ru": "Ошибка при попытке передать ID активации без переадресации, или же завершенной/не активной активации.",
			"en": "An error occurred while trying to transfer an activation ID without forwarding, or a completed/inactive activation.",
			"action": "fail"
		},
		"REPEAT_ADDITIONAL_SERVICE": {
			"ru": "Ошибка возникает при попытке заказать купленный сервис еще раз.",
			"en": "An error occurs when trying to order a purchased service again.",
			"action": "fail"
		},
		"ACCOUNT_INACTIVE": {
			"ru": "Свободных номеров нет.",
			"en": "No numbers.",
			"action": "fail"
		},
		"NO_ID_RENT": {
			"ru": "Не указан id Аренды.",
			"en": "Rent id not specified.",
			"action": "fail"
		},
		"INVALID_PHONE": {
			"ru": "Номер арендован не вами (неправильный id аренды).",
			"en": "Number is not rented by you (wrong rental id).",
			"action": "fail"
		},
		"STATUS_FINISH": {
			"ru": "Аренда оплачна и завершена.",
			"en": "Rent paid and completed.",
			"action": "fail"
		},
		"STATUS_CANCEL": {
			"ru": "Аренда отменена с возвратом денег.",
			"en": "Rent canceled with refund.",
			"action": "fail"
		},
		"STATUS_WAIT_CODE": {
			"ru": "Ожидание первой смс.",
			"en": "Waiting for the first sms.",
			"action": "fail"
		},
		"INCORECT_STATUS": {
			"ru": "Отсутствует или неправильно указан статус.",
			"en": "Missing or incorrect status.",
			"action": "fail"
		},
		"CANT_CANCEL": {
			"ru": "Невозможно отменить аренду (более 20 мин.).",
			"en": "It is impossible to cancel the rental (more than 20 minutes).",
			"action": "fail"
		},
		"ALREADY_FINISH": {
			"ru": "Аренда уже завершена.",
			"en": "Rental is already completed.",
			"action": "fail"
		},
		"ALREADY_CANCEL": {
			"ru": "Аренда уже отменена.",
			"en": "Rent already canceled.",
			"action": "fail"
		},
		"RENT_DIE": {
			"ru": "Аренду невозможно продлить, так как срок жизни номера истёк.",
			"en": "Rent cannot be extended because the number has expired.",
			"action": "fail"
		},
		"WRONG_OPERATOR": {
			"ru": "Оператор переданной аренды не MTT.",
			"en": "Rent transferred operator not MTT.",
			"action": "fail"
		},
		"INVALID_TIME": {
			"ru": "Неверное время. Доступное количество часов от 4 до 1344.",
			"en": "Wrong time. Available number of hours from 4 to 1344.",
			"action": "fail"
		},
		"BANNED": {
			"ru": "Аккаунт заблокирован до " + errorText,
			"en": "Account blocked until " + errorText,
			"action": "fail"
		},
		
		/* sms-reg */
		
		"ERROR_WRONG_KEY": {
			"ru": "Неверный API-ключ.",
			"en": "Invalid API key.",
			"action": "die",
			"instantly": true
		},
		"ERROR_KEY_NEED_CHANGE": {
			"ru": "API-ключ требует замены.",
			"en": "API key needs to be replaced.",
			"action": "die",
			"instantly": true
		},
		"ERROR_NO_KEY": {
			"ru": "API-ключ не указан.",
			"en": "API key not specified.",
			"action": "die",
			"instantly": true
		},
		"WARNING_LOW_BALANCE": {
			"ru": "Недостаточно денег на счету.",
			"en": "Not enough money in the account.",
			"action": "die",
			"instantly": false
		},
		"Service not define": {
			"ru": "Сервис не определен.",
			"en": "Service not defined.",
			"action": "fail"
		},
		"TZID must be number": {
			"ru": "Значение TZID должно быть числом.",
			"en": "The TZID value must be a number.",
			"action": "fail"
		},
		"There is no TZID value": {
			"ru": "TZID не указано.",
			"en": "TZID not specified.",
			"action": "fail"
		},
		"Wrong characters in parameters": {
			"ru": "Недопустимые символы в передаваемых данных.",
			"en": "Invalid characters in the transmitted data.",
			"action": "fail"
		},
		"Rate change can be made when all current operations finished": {
			"ru": "Изменение ставки возможно после завершения всех операций.",
			"en": "Changing the rate is possible after the completion of all operations.",
			"action": "fail"
		},
		"WARNING_WAIT15MIN": {
			"ru": "Вы не использовали много из выданных номеров и поэтому выдача новых номеров заморожена на 15 минут.",
			"en": "You have not used many of the issued numbers and therefore the issuance of new numbers is frozen for 15 minutes.",
			"action": "fail"
		},
		"WARNING_NO_NUMS": {
			"ru": "Нет подходящих номеров.",
			"en": "No matching numbers.",
			"action": "fail"
		},
		"TZ_OVER_OK": {
			"ru": "Операция завершена.",
			"en": "Operation completed.",
			"action": "fail"
		},
		"TZ_OVER_EMPTY": {
			"ru": "Ответ не поступил за отведенное время.",
			"en": "The answer was not received within the allotted time.",
			"action": "fail"
		},
		"TZ_OVER_NR": {
			"ru": "Вы не отправили запрос методом setReady.",
			"en": "You did not send the request with the setReady method.",
			"action": "fail"
		},
		"TZ_DELETED": {
			"ru": "Операция удалена, средства возвращены.",
			"en": "Operation deleted, funds returned.",
			"action": "fail"
		},
		
		/* smspva */
		
		"API KEY NOT FOUND!": {
			"ru": "Неверный API-ключ.",
			"en": "Invalid API key.",
			"action": "die",
			"instantly": true
		},
		"Service NOT FOUND!": {
			"ru": "Сервис не найден.",
			"en": "Service not found.",
			"action": "fail"
		},
		
		/* onlinesim */
		
		"ACCOUNT_BLOCKED": {
			"ru": "Аккаунт заблокирован.",
			"en": "Account is blocked.",
			"action": "fail"
		},
		"ERROR_NO_SERVICE": {
			"ru": "Сервис не указан.",
			"en": "Service not specified.",
			"action": "fail"
		},
		"REQUEST_NOT_FOUND": {
			"ru": "Метод API не указан.",
			"en": "API method not specified.",
			"action": "fail"
		},
		"API_ACCESS_DISABLED": {
			"ru": "API выключено.",
			"en": "API disabled.",
			"action": "fail"
		},
		"API_ACCESS_IP": {
			"ru": "Доступ с данного ip выключен в профиле.",
			"en": "Access from this ip is disabled in the profile.",
			"action": "fail"
		},
		"EXCEEDED_CONCURRENT_OPERATIONS": {
			"ru": "Превышено количество одновременно заказанных номеров для Вашего аккаунта.",
			"en": "Maximum quantity of numbers booked concurrently is exceeded for your account.",
			"action": "fail"
		},
		"NO_NUMBER": {
			"ru": "Для выбранного сервиса свободные номера временно отсутствуют.",
			"en": "Temporarily no numbers available for the selected service.",
			"action": "fail"
		},
		"TIME_INTERVAL_ERROR": {
			"ru": "Отложенный прием СМС не возможен в данный интервал времени.",
			"en": "Delayed SMS reception is not possible at this interval of time.",
			"action": "fail"
		},
		"INTERVAL_CONCURRENT_REQUESTS_ERROR": {
			"ru": "Превышено количество одновременных запросов на выдачу номера, повторите запрос позднее.",
			"en": "Maximum quantity of concurrent requests for number issue is exceeded, try again later.",
			"action": "fail"
		},
		"TRY_AGAIN_LATER": {
			"ru": "Запрос временно не может быть выполнен.",
			"en": "Temporarily unable to perform the request.",
			"action": "fail"
		},
		"NO_FORWARD_FOR_DEFFER": {
			"ru": "Активация переадресации возможна только на онлайн приеме.",
			"en": "Forwarding can be activated only for online reception.",
			"action": "fail"
		},
		"NO_NUMBER_FOR_FORWARD": {
			"ru": "Нет номеров для переадресации.",
			"en": "There are no numbers for forwarding.",
			"action": "fail"
		},
		"ERROR_LENGTH_NUMBER_FOR_FORWARD": {
			"ru": "Номер для переадресации имеет не верную длину.",
			"en": "Wrong length of the number for forwarding.",
			"action": "fail"
		},
		"DUPLICATE_OPERATION": {
			"ru": "Добавление операций с одинаковыми параметрами.",
			"en": "Adding operations with identical parameters.",
			"action": "fail"
		},
		"ERROR_NO_TZID": {
			"ru": "TZID не указано.",
			"en": "TZID not specified.",
			"action": "fail"
		},
		"ERROR_NO_OPERATIONS": {
			"ru": "Нет операций.",
			"en": "No operations.",
			"action": "fail"
		},
		"ACCOUNT_IDENTIFICATION_REQUIRED": {
			"ru": "Необходимо пройти идентификацию: для заказа мессенджера - любым способом, для переадресации - по паспорту.",
			"en": "You have to go through an identification process: to order a messenger - in any way, for forward - on the passport.",
			"action": "fail"
		},
		"ERROR_WRONG_TZID": {
			"ru": "Неверный номер операции.",
			"en": "Wrong operation number.",
			"action": "fail"
		},
		"NO_COMPLETE_TZID": {
			"ru": "Невозможно завершить операцию.",
			"en": "Unable to complete the operation.",
			"action": "fail"
		},
		"UNDEFINED_COUNTRY": {
			"ru": "Не верно указана страна.",
			"en": "Country specified incorrectly.",
			"action": "fail"
		},
		"UNDEFINED_DAYS": {
			"ru": "Не верно указано количество дней.",
			"en": "The number of days is incorrect.",
			"action": "fail"
		},
		
		/* sms-acktiwator */
		
		101: {
			"ru": "Cервис не найден.",
			"en": "Service not found.",
			"action": "fail"
		},
		102: {
			"ru": "Недостаточно денег на счету.",
			"en": "Not enough money in the account.",
			"action": "die",
			"instantly": false
		},
		103: {
			"ru": "Нет доступных номеров.",
			"en": "No numbers available.",
			"action": "fail"
		},
		201: {
			"ru": "API-ключ не указан.",
			"en": "API key not specified.",
			"action": "die",
			"instantly": true
		},
		202: {
			"ru": "Неверный API-ключ.",
			"en": "Invalid API key.",
			"action": "die",
			"instantly": true
		},
		203: {
			"ru": "Аккаунт заблокирован | " + errorText,
			"en": "Account blocked | " + errorText,
			"action": "fail"
		},
		
		/* vak-sms */
		
		"apiKeyNotFound": {
			"ru": "Неверный API-ключ.",
			"en": "Invalid API key.",
			"action": "die",
			"instantly": true
		},
		"noMoney": {
			"ru": "Недостаточно денег на счету.",
			"en": "Not enough money in the account.",
			"action": "die",
			"instantly": false
		},
		"noService": {
			"ru": "Данный сервис не поддерживается, свяжитесь с администрацией сайта.",
			"en": "This service is not supported, please contact the site administration.",
			"action": "fail"
		},
		"noCountry": {
			"ru": "Запрашиваемая страна отсутствует.",
			"en": "The requested country is missing.",
			"action": "fail"
		},
		"noOperator": {
			"ru": "Оператор не найдет для запрашиваемой страны.",
			"en": "The operator will not find for the requested country.",
			"action": "fail"
		},
		"noNumber": {
			"ru": "Нет номеров, попробуйте позже.",
			"en": "No numbers, please try later.",
			"action": "fail"
		},
		"badStatus": {
			"ru": "Неверный статус.",
			"en": "Invalid status.",
			"action": "fail"
		},
		"idNumNotFound": {
			"ru": "Неверный ID операции.",
			"en": "Invalid operation ID.",
			"action": "fail"
		},
		"badService": {
			"ru": "Неверный код сайта, сервиса, соц.сети.",
			"en": "Invalid website, service, social network code.",
			"action": "fail"
		},
		"badData": {
			"ru": "Отправлены неверные данные.",
			"en": "Invalid data sent.",
			"action": "fail"
		},
		
		/* give-sms */
		
		401: {
			"ru": "Неверный API-ключ.",
			"en": "Invalid API key.",
			"action": "die",
			"instantly": true
		},
		404: {
			"ru": "Неправильно задан параметр method.",
			"en": "The method parameter is set incorrectly.",
			"action": "fail"
		},
		500: {
			"ru": "Ошибка при обработке запроса / Нет доступных номеров.",
			"en": "Error processing request / No numbers available.",
			"action": "fail"
		},
		502: {
			"ru": "Сервис не существует.",
			"en": "Service does not exist.",
			"action": "fail"
		},
		503: {
			"ru": "Оператора не существует.",
			"en": "Operator does not exist.",
			"action": "fail"
		},
		504: {
			"ru": "Недостаточно денег на счету.",
			"en": "Not enough money in the account.",
			"action": "die",
			"instantly": false
		},
		505: {
			"ru": "Страна не существует.",
			"en": "Country does not exist.",
			"action": "fail"
		},
		506: {
			"ru": "Не указан параметр order_id.",
			"en": "order_id parameter not specified.",
			"action": "fail"
		},
		666: {
			"ru": "Многократный бан номеров.",
			"en": "Multiple ban of numbers.",
			"action": "fail"
		}
	};
	var message = this.name + ": " + error;
	var errorObj = errors[error];
	if(_is_nilb(errorObj)){
		/* sms-reg */
		var reg1 = /(\S+) to this TZID not applicable/;
		var reg2 = /There is no (\S+) value/;
		if(reg1.test(error)){
			var method = error.match(reg1)[1];
			errorObj = {
				"ru": "Метод " + method + " не применим к указанному TZID.",
				"en": "The " + method + " method is not applicable to the specified TZID.",
				"action": "fail"
			};
		};
		if(reg2.test(error)){
			var parameter = error.match(reg2)[1];
			errorObj = {
				"ru": "Параметр " + parameter + " не указан.",
				"en": "Parameter " + parameter + " not specified.",
				"action": "fail"
			};
		};
	};
	if(errorObj){
		message += " - " + errorObj[_K]
		if(errorObj["action"]=="fail"){
			fail(message);
		}else{
			die(message, errorObj["instantly"]);
		};
	}else{
		if(error==errorText || !errorText){
			fail(message);
		}else{
			fail(message + ", " + errorText);
		};
	};
};