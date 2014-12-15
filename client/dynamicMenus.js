//////////////////////////////////////////////////////////////////////////////////
// Session Management...
Session.setDefault('showAddCategory', false);
Session.setDefault('showAddItem', false);
// Linking vars
Session.setDefault('categoryId', null);


//////////////////////////////////////////////////////////////////////////////////
// Categories 
Template.categories.helpers({
	categories: function () {
		return Categories.find({});
	}
});
// Events
Template.categories.events({
	'click .addCategory': function (evt) {
		Session.set('showAddCategory', true);
	},
	'click .addItem': function (evt) {
		Session.set('categoryId', this._id);
		Session.set('showAddItem', true);
	},
	'click .deleteCategory': function (evt) {
		var arrItems = Items.find({category: this._id}).fetch();
		_.each(arrItems, function (item) {
			Items.remove(item._id);
		});
		Categories.remove(this._id);
	}
});


//////////////////////////////////////////////////////////////////////////////////
// Items 
Template.items.helpers({
	items: function () {
		return Items.find({'category': this._id});
	}
});
// Events
Template.categories.events({
	'click .deleteItem': function (evt) {
		Items.remove(this._id);
	}
});


//////////////////////////////////////////////////////////////////////////////////
// Modals...
Template.modals.helpers({
	showAddCategory: function () {
		return Session.get('showAddCategory');
	}
});
Template.modals.helpers({
	showAddItem: function () {
		return Session.get('showAddItem');
	}
});

// Add Category
// Events
Template.add_category.events({
	'click .save': function (evt) {
		var strName = $('#add-name').val();
		var chart = $('#container').highcharts();
		chart.setTitle({
			text: strName
		});
		Categories.insert({
			name: strName
		});
		Session.set('showAddCategory', false);
	},
	'click .cancel': function (evt) {
		Session.set('showAddCategory', false);
	}
});

// Add Category
// Events
Template.add_item.events({
	'click .save': function (evt) {
		var strName = $('#add-name').val();
		var strData = tagsString($('#add-data').val());
		var chart = $('#container').highcharts();
		chart.addSeries({
			name: strName,
			data: strData
		});
		Items.insert({
			name: strName,
			category: Session.get('categoryId'),
			data: strData
		});
		Session.set('showAddItem', false);
	},
	'click .cancel': function (evt) {
		Session.set('showAddItem', false);
	}
});


//////////////////////////////////////////////////////////////////////////////////
// Rendered...
Template.categories.rendered = function () {
	$(function () {
		$('#container').highcharts({
			title: {
				text: 'Monthly Average Temperature',
				x: -20 //center
			},
			subtitle: {
				text: 'Source: WorldClimate.com',
				x: -20
			},
			xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
			},
			yAxis: {
				title: {
					text: 'Temperature (°C)'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			tooltip: {
				valueSuffix: '°C'
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			},
			series: [{
				name: 'Tokyo', 
				data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 
				25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
			}] 
		});
	});
};


//////////////////////////////////////////////////////////////////////////////////
// Methods...
var tagsString = function (tags) {
	var tagsArray = [];
	$.each(tags.split(","), function () {
		tagsArray.push(parseInt(this));
	});
	return tagsArray;
};