_call(BrowserAutomationStudio_GetFingerprint,[{
	tags: (<%= tags %>),
	key: (<%= key %>),
	min_browser_version: (<%= min_browser_version %>),
	min_width: (<%= min_width %>),
	min_height: (<%= min_height %>),
	max_width: (<%= max_width %>),
	max_height: (<%= max_height %>),
	time_limit: (<%= time_limit %>),
	perfectcanvas_request: (<%= perfectcanvas_request %>),
	perfectcanvas_logs: (<%= perfectcanvas_logs %>),
}])!

<%= variable %> = _result()
