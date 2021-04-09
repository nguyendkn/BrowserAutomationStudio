function _SMS_ErrorHandler(config, error){
	var errors = {
		"FAILED_REQUEST": {
			"ru": "Не удалось успешно выполнить запрос к сервису за 10 попыток.",
			"en": "Failed to successfully complete the request to the service in 10 attempts.",
			"action": "fail"
		},
		"RESPONSE_IS_NOT_JSON": {
			"ru": "Не удалось распарсить ответ от сервиса.",
			"en": "Failed to parse the response from the service.",
			"action": "fail"
		},
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
			"action": "die",
			"instantly": true
		},
		"BAD_SERVICE": {
			"ru": "Некорректное наименование сервиса.",
			"en": "Incorrect service name.",
			"action": "die",
			"instantly": true
		},
		"WRONG_EXCEPTION_PHONE": {
			"ru": "Некорректные исключающие префиксы.",
			"en": "Invalid exclusion prefixes.",
			"action": "die",
			"instantly": true
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
			"action": "die",
			"instantly": true
		},
		"NOT_AVAILABLE": {
			"ru": "Для страны, которую вы используете, недоступна покупка мультисервисов.",
			"en": "Multiservice purchase is not available for the country you are using.",
			"action": "die",
			"instantly": true
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
			"action": "die",
			"instantly": true
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
		}
	};
	var message = config.serviceName + ": " + error;
	if(errors[error]){
		message += " - " + errors[error][_K]
		if(errors[error]["action"]=="fail"){
			fail(message);
		}else{
			die(message, errors[error]["instantly"]);
		};
	}else{
		fail(message);
	};
};