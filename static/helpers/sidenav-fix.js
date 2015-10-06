$(document).ready(
	function(){
		$(".md-sidenav-left").hover(
			function(){
				if ($(window).width()>960){
					console.log("in");
					$(".md-sidenav-left").removeClass('md-sidenav-minimized');
				}
			},
			function(){
				if ($(window).width()>960){
					console.log("out");
					$(".md-sidenav-left").addClass('md-sidenav-minimized');
				}
			}
		);
		$(window).resize(function(){
			if ($(window).width()>960){
				$(".md-sidenav-left").addClass('md-sidenav-minimized');
			}
			else{
				$(".md-sidenav-left").removeClass('md-sidenav-minimized');
			}
			//
			//	Исправляем размеры правого навбара с диалогами
			var navbar=$(".md-sidenav-right");
			navbar.children().height(navbar.height());
		});
		if ($(window).width()>960){
			$(".md-sidenav-left").addClass('md-sidenav-minimized');
		}
		else{
			$(".md-sidenav-left").removeClass('md-sidenav-minimized');
		}
		//
		//	Исправляем размеры правого навбара с диалогами
		var navbar=$(".md-sidenav-right");
		navbar.children().height(navbar.height());
	}

);
