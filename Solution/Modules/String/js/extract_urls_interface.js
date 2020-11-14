<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string from which to extract links."),examples:[{code:tr("Text https://marketplace.biz/section_3/product_213234.php")},{code:tr("</br>Test text http://test.com, string test example.org")},{code:tr("</br>Ad -> http://www.ad.by/info, feedback -> www.feedback.io, support -> https://support.co/new/ticket.php")}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "URLS_LIST", help: {description: tr("Variable in which, after successful execution of the action, the list of links will be written."), examples:[{code:"[\"https://marketplace.biz/section_3/product_213234.php\"]"},{code:"[\"http://test.com\", \"example.org\"]"},{code:"[\"http://www.ad.by\", \"www.feedback.io\", \"https://support.co/new/ticket.php\"]"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Extract all links from string.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
