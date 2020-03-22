function EmbeddedModel()
{
	var Languages = []
	var Data = []
	var DataRaw = ""
	var DataRemoved = []
	var CheckData = null
	var CheckId = ""
	var CheckCallback = null

	this.GetAllFiles = function()
	{
		return Data.filter((l) => {
			return l["data_type"] == 1
		})
	}

	this.Update = function(update_data)
	{

		update_data.split(";").forEach((el) => {
			var split = el.split(",")
			
			if(split[0] == "delete")
			{
				Data = Data.filter(function(item) {
					if(item["data_name"] == split[1])
						DataRemoved.push(item)
    				return item["data_name"] != split[1];
				})
			}else if(split[0] == "duplicate")
			{
				var found = Data.find(function(item) {
    				return item["data_name"] == split[1];
				})
				if(typeof(found) == "undefined")
				{
					found = null
				}

				if(found)
				{
					var duplicate = {}
					duplicate["data"] = found["data"]
					duplicate["data_name"] = split[2]
					duplicate["data_type"] = found["data_type"]
					duplicate["language_name"] = found["language_name"]
					duplicate["language_version"] = found["language_version"]
					Data.push(duplicate)
				}
			}else if(split[0] == "restore")
			{
				var found = DataRemoved.find(function(item) {
    				return item["data_name"] == split[1];
				})
				if(typeof(found) == "undefined")
				{
					found = null
				}

				if(found)
				{
					Data.push(found)
				}

				DataRemoved = DataRemoved.filter(function(item) {
    				return item["data_name"] != split[1];
				})
			}

		})
		this.SendCode("")


	}

	this.SendCode = function(check_id)
	{
		var Code = this.SerializeData()

		/*var d = new diff_match_patch()

		var diff = d.diff_main(DataRaw, Code)

		var patch = d.patch_toText(d.patch_make(diff))*/

		var patch = Code

		DataRaw = Code

		CheckId = check_id

		BrowserAutomationStudio_SendEmbeddedData(check_id + "|" + patch)
	}

	this.ParseData = function(data, languages)
	{
		DataRaw = data
		Data = JSON.parse(data)
		Languages = languages.split(";").map( (l) => {
			var split = l.split(",")
			return {name: split[0], version: split[1]}
		})
	}

	this.GetVersionsForLanguages = function(language)
	{
		return Languages.filter((l) => {
			return l["name"] == language
		}).map((l) => {
			return l["version"]
		})
	}

	this.InsertOrReplaceData = function(data, language_name, language_version, callback)
	{
		data.forEach(function(dat){
			var found = Data.find((el) => {
				return el["data_type"] == dat["data_type"] && el["data_name"] == dat["data_name"] && el["language_version"] == dat["language_version"] && el["language_name"] == dat["language_name"]
			})
			if(typeof(found) == "undefined")
			{
				found = null
			}

			if(found)
			{
				found["data"] = dat["data"]
			}else
			{
				Data.push(dat)
			}
		})

		var file_names = data.filter(function(el){return el["data_type"] == 1 }).map(function(el){return el["data_name"]})

		Data = Data.filter((d) => {
			var same = d["data_type"] == 1 && d["language_name"] == language_name && d["language_version"] == language_version
			if(!same)
				return true
			return file_names.indexOf(d["data_name"]) >= 0
		})

		var id = Math.random().toString(36).substring(2)
		
		CheckData = DataRaw
		CheckId = id
		CheckCallback = callback
		
		this.SendCode(id)
	}

	this.CheckResult = function(check_id, is_success, error_string)
	{
		if(check_id == CheckId)
		{
			if(!is_success)
			{
				Data = JSON.parse(CheckData)
				DataRaw = CheckData
			}
			CheckData = null
			CheckId = ""
			CheckCallback(is_success, error_string)
			CheckCallback = null
		}
		
	}

	this.SerializeData = function()
	{
		return JSON.stringify(Data)
	}

	this.GetFunctionCode = function(name)
	{
		var found = Data.find((el) => {
			return el["data_type"] == 0 && el["data_name"] == name
		})

		if(typeof(found) == "undefined")
		{
			found = null
		}

		if(!found)
			return ""

		return found["data"]
	}
}