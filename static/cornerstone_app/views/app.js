//
//
//
//		MODULE:::
//
//
//
angular.module('Cornerstone')

.directive('dicomBaseView', [function() {
	return {
		link:function link(scope, element, attrs) {
			var dicomUrl=attrs.dicomBaseView;
			var e=$(element).get(0);
			scope.loaded=false;
			cornerstone.enable(e);
			cornerstone_helpers.loadAndViewImage(dicomUrl, e,
												 function(){
													 scope.$apply(function(){
														 scope.loaded=true;
													 })
												 });
		}
	}
}])

.directive('dicomBaseInfoBasic', [function() {
	return {
		link:function link(scope, element, attrs) {
		},
		templateUrl: '/static/cornerstone_app/views/dicomInfoBasic.html'
	}
}])

.directive('dicomBaseInfoImageEquipment', [function() {
	return {
		link:function link(scope, element, attrs) {
		},
		templateUrl: '/static/cornerstone_app/views/dicomInfoImageEquipment.html'
	}
}])



.filter('dataDicom', function() {
	return function(elementHex) {
		var dataSet=cornerstone_helpers.currentDataSet;
		if (!dataSet){ return; }


		var element = dataSet.elements[elementHex];
		var text = "";
		if(element !== undefined){
			var str = dataSet.string(elementHex);
			if(str !== undefined) {
				text = str;
			}
		}
		return text;
	};
})


.filter('dataDicomUint', function() {
	return function(elementHex) {
		var dataSet=cornerstone_helpers.currentDataSet;
		if (!dataSet){ return; }

		var element = dataSet.elements[elementHex];
		var text = "";

		if(element !== undefined){
			if(element.length === 2){
				text = dataSet.uint16(elementHex);
			}
			else if(element.length === 4){
				text = dataSet.uint32(elementHex);
			}
		}
		return text;
	};
})



;

