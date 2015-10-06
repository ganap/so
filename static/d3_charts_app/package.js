angular.module('uiD3Charts',[])

.directive('d3ForceCareTeamChart', [ function( ) {
	//
	//
	return {
		restrict: 'E',
		scope: {
			links:'=',
			nodes:'=',
			onNodeClick: '&?'
		},
		link: function($scope, element, attr){

			$scope.$watch('links', function(links) {
				console.log(links);
				if (!links) return;
				if (links.length<2) return;
				console.log($scope.links[0]);
				element.empty();
				

			var width = element.width(),
				height = element.height(),
				IMG_SIZE=50;

			var svg = d3.select(element.get(0)).append("svg")
				.attr("width", width)
				.attr("height", height);

			//	два круга которые обрезают квадратные картинки
				//	в круг

			svg.append("defs")
				.append("clipPath")
				.attr('id', "circleCip")
				.append("circle")
				.attr("r", IMG_SIZE/2);

			svg.append("defs")
				.append("clipPath")
				.attr('id', "circleCipBig")
				.append("circle")
				.attr("r", IMG_SIZE*1.2/2);

			var force = d3.layout.force()
				.gravity(0)
				.distance(150)
				.charge(-100)
				.size([width, height]);

	//	d3.json("/static/graph4.json", function(error, json) {
	//			if (error) throw error;

				force
					.nodes($scope.nodes)
					.links($scope.links)
					.start();

				var link = svg.selectAll(".link")
					.data($scope.links)
					.enter().append("line")
					.attr("class", "d3ForceCareTeamChart link");

				var node = svg.selectAll(".node")
					.data($scope.nodes)
					.enter().append("g")
					.attr("class", "d3ForceCareTeamChart node")
					.call(force.drag);



			
				node.append("image")
					.attr("xlink:href", force_helpers.getAvatar)
					.attr("clip-path", force_helpers.getCircleCip)
					.attr("x", force_helpers.xyImgPosition)
					.attr("y", force_helpers.xyImgPosition)
					.attr("width", force_helpers.getImgSize)
					.attr("height",force_helpers.getImgSize);

					node.on('click', function(d){
						if ($scope.onNodeClick){
							$scope.onNodeClick({person:d});
						}
						console.log(d);
					})

				node.append("text")
					.attr("dx", force_helpers.xForTitle)
					.attr("dy", force_helpers.yForTitle(2))
					.attr('class', 'summary')
					.style('font-size', '0.8em')
					.attr("text-anchor",force_helpers.textAlign)
					.text(force_helpers.getSummary);

				node.append("text")
					.attr("dx",force_helpers.xForTitle)
					.attr("dy", force_helpers.yForTitle(1))
					//.attr('fill', 'green')
					.attr('class', 'text')
					.attr("text-anchor", force_helpers.textAlign)
					.text(force_helpers.getName);


				force.on("tick", function(e) {

					link.attr("x1", function(d) { return d.source.x; })
						.attr("y1", function(d) { return d.source.y; })
						.attr("x2", function(d) { return d.target.x; })
						.attr("y2", function(d) { return d.target.y; });

					node.attr("transform", function(d) { 
						if (d.index==0){
							damper = 0.1;
							d.x = d.x + (width/2 - d.x) * (damper + 0.71) * e.alpha;
							d.y = d.y + (height/2 - d.y) * (damper + 0.71) * e.alpha;
							return "translate(" + d.x+ "," + d.y + ")";
						}
						return "translate(" + d.x+ "," + d.y + ")"; 
					});
				});
		//	});
			});
		}
	};
}])


;
