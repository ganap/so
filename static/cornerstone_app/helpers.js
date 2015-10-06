var cornerstone_helpers={};

cornerstone_helpers.currentDataSet = null;

cornerstone_helpers.loadAndViewImage = function(imageId, viewportDiv, onDoneFunc) {

	imageId="wadouri:"+imageId;

	cornerstone.loadImage(imageId).then(function(image) {
		var viewport = cornerstone.getDefaultViewportForImage(viewportDiv, image);
		cornerstone_helpers.currentDataSet=image.data; //распарсеный файл для дальнейшего отображения базовой информации.



		cornerstone.displayImage(viewportDiv, image, viewport);

		cornerstoneTools.mouseInput.enable(viewportDiv);
		cornerstoneTools.mouseWheelInput.enable(viewportDiv);
		cornerstoneTools.wwwc.activate(viewportDiv, 1); // ww/wc is the default tool for left mouse button
		cornerstoneTools.pan.activate(viewportDiv, 2); // pan is the default tool for middle mouse button
		cornerstoneTools.zoom.activate(viewportDiv, 4); // zoom is the default tool for right mouse button

		cornerstoneTools.probe.enable(viewportDiv);
		cornerstoneTools.length.enable(viewportDiv);
		cornerstoneTools.ellipticalRoi.enable(viewportDiv);
		cornerstoneTools.rectangleRoi.enable(viewportDiv);
		cornerstoneTools.angle.enable(viewportDiv);
		cornerstoneTools.highlight.enable(viewportDiv);
		try{
			onDoneFunc();
		}
		catch(e){}

	}, function(err) {
		console.log(err);
	});
}

