var d3, fileData;

var openFiles = [];

/**
 * Function called when body is loaded
 */
function init() {
	readFiles();
}

/**
 *  Initial sortable elements
 */
function initSort() {
	$("#sortable")
		.sortable()
		.disableSelection();

	$("#sortable li").on('click', function(){
		openFile($(this).attr('id').replace('item-', ''));
	});

	updateDraggables();

}

/**
 * Read the files using d3 and save the data in a array.
 *
 * Add the files to the document browser list and allow them to be sortable.
 *
 */
function readFiles() {

	d3.tsv("Datasets/documents.tsv").then(function(data) {
		fileData = data;

		data.forEach(function (file) {
			$("#file-sorter ul").append(
				$('<li class="ui-state-default" id="item-'+file.id+'">' +
					'<span class="handle ui-icon ui-icon-arrowthick-2-n-s"></span>'+file.id+
					'</li>')
			)
		});

		initSort();
	});
}

/**
 * open the given fileId in the workspace
 * @param fileId
 */
function openFile(fileId) {
	if(openFiles.indexOf(fileId) === -1) {
		openFiles.push(fileId);
		$('#containment-wrapper').append(documentTemplate(getFileDataById(fileId)));
		updateDraggables();
		updatedSelected();
	}
}

/**
 * Close the given fileId in the workspace
 *
 * @param fileId
 */
function closeFile(fileId) {
	openFiles = openFiles.filter(function (id) {
		return id !== fileId.replace('card-', '');
	});
	updatedSelected();
}

/**
 * Return file from file data array by id
 *
 * @param id
 * @returns file
 */
function getFileDataById(id){
	return fileData.filter(function (file) {
		return file.id === id;
	})[0];
}

/**
 * Temaplte for the card in the document workspace
 *
 * @param file
 * @returns {string} html string
 */
function documentTemplate(file) {
	return '<div id="card-'+ file.id+ '" class="card draggable ui-widget-content w-50">' +
		'<p class="card-header">'+ file.id + '<span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></p>' +
		'<p class="card-body">'+ file.content + '</p>' +
	'</div>'
}

/**
 *  Function for initiating draggables in the document workspace.
 */
function updateDraggables() {
	$(".draggable").draggable({ containment: "#containment-wrapper" });

	$(".draggable").on( "click", "span.ui-icon-close", function() {
		var fileId = $( this ).closest( "div" ).attr('id').replace('card-', '');
		$( this ).closest( "div" ).remove();
		closeFile(fileId);
	});
}

/**
 * Updated the selected items in the list using the ids in the open files
 */
function updatedSelected() {
	$("#file-sorter ul li").removeClass('selected');
	$(openFiles.map(function (id) {
		return '#item-' + id
	}).join(',')).addClass('selected')
}