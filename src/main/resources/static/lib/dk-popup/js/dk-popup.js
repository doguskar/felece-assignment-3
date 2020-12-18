dkPopup = function(e){
	defs = {
		model: "default", //clasic, simple-confirm
		style: "primary", //danger, warn, success
		type: "alert", //alert, confirm, iframe
		duration: -1, //s
		wait: -1, //s
		animation: "bounce",
		aniIn: "bounceInUp", //Animation.css
		aniOut: "bounceOut",
		closeable: true,
		title: "",
		content: "",
		closeLabel: "Close",
		confirmLabel: "Confirm",
		confirmClick: function(){ console.log("Confirm Clicked!");},
		iframeSrc: undefined,
		btnDatas: {},
		closeDkPop: function(){
						if(defs.isRemoved == undefined){
							defs.isRemoved = true;
							dkPop.classList.add(defs.aniOut);
							setTimeout(function(){
								dkPopOver.parentNode.removeChild(dkPopOver);
							},500);
						}
					}
	};
	switch(e.model){
		case "clasic": defs.model = "clasic"; break;
		case "simple-confirm": defs.model = "simple-confirm"; break;
	}
	switch(e.style){
		case "danger": defs.style = "danger"; break;
		case "warn": defs.style = "warn"; break;
		case "success": defs.style = "success"; break;
	}
	switch(e.type){
		case "alert": defs.type = "alert"; break;
		case "confirm": defs.type = "confirm"; break;
		case "iframe": defs.type = "iframe"; break;
	}
	/* ANIMATIONS */
	switch(e.animation){
		case "bounce": defs.aniIn = "bounceInUp"; defs.aniOut = "bounceOut"; break;
		case "fadeDown": defs.aniIn = "fadeInDown"; defs.aniOut = "fadeOutUp"; break;
		case "flip": defs.aniIn = "flipInX"; defs.aniOut = "flipOutX"; break;
		case "zoom": defs.aniIn = "zoomIn"; defs.aniOut = "zoomOutDown"; break;
	}
	if(e.aniIn != undefined)
		defs.aniIn = e.aniIn;
	if(e.aniOut != undefined)
		defs.aniOut = e.aniOut;
	/* ANIMATIONS */
	if(e.title != undefined)
		defs.title = e.title;
	if(e.content != undefined)
		defs.content = e.content;
	if(e.closeLabel != undefined)
		defs.closeLabel = e.closeLabel;
	if(e.confirmLabel != undefined)
		defs.confirmLabel = e.confirmLabel;
	if(e.iframeSrc != undefined)
		defs.iframeSrc = e.iframeSrc;
	if(e.duration != undefined && !isNaN(e.duration))
		defs.duration = e.duration;
	if(e.wait != undefined && !isNaN(e.wait))
		defs.wait = e.wait;
	if(e.closeable == false || e.closeable == 0)
		defs.closeable = false;
	if(e.btnDatas != undefined && (typeof e.btnDatas) == "object")
		defs.btnDatas = e.btnDatas;
	if(e.confirmClick != undefined)
		defs.confirmClick = e.confirmClick;
	
	
	
	var dkPopOver = document.createElement("div");
	dkPopOver.classList.add("dk-popup-overlay");
	
		var middle = document.createElement("div");
		middle.classList.add("middle");
	
			var dkPop = document.createElement("div");
			dkPop.classList.add("dk-popup", "animated", "faster");
			dkPop.classList.add(defs.aniIn);
			switch(defs.model){
				case "clasic": dkPop.classList.add("clasic"); break;
				case "simple-confirm": dkPop.classList.add("simple-confirm"); break;
			}
			switch(defs.style){
				case "danger": dkPop.classList.add("danger"); break;
				case "warn": dkPop.classList.add("warn"); break;
				case "success": dkPop.classList.add("success"); break;
			}
				/* HEADER */
				if(defs.title != ""){
					var header = document.createElement("div");
					header.classList.add("dp-header");
					header.innerHTML = defs.title;
					dkPop.appendChild(header);
				}
				/* ARTICLE */
				var article = document.createElement("div");
				article.classList.add("dp-article");
				if(defs.type == "iframe" && defs.iframeSrc != undefined){
					var iframeOverlay =  document.createElement("div");
					iframeOverlay.classList.add("resp-container");
					var iframe = document.createElement("iframe");
					iframe.setAttribute("src", defs.iframeSrc);
					iframe.classList.add("resp-iframe");
					iframeOverlay.appendChild(iframe);
					article.appendChild(iframeOverlay);
					article.style.paddingLeft = 0;
					article.style.paddingRight = 0;
				}else{
					article.innerHTML = defs.content;
				}
				dkPop.appendChild(article);
				if(defs.closeable){
					/* FOOTER */
					var footer = document.createElement("div");
					footer.classList.add("dp-footer");
					/*Close Btn*/
					closeBtn = document.createElement("a");
					closeBtn.setAttribute("href", "javascript:;");
					closeBtn.classList.add("pop-btn");//, "primary"
					closeBtn.innerHTML = defs.closeLabel;
					footer.appendChild(closeBtn);
					closeBtn.addEventListener("click", function(){
						if(defs.isRemoved == undefined){
							defs.isRemoved = true;
							dkPop.classList.add(defs.aniOut);
							setTimeout(function(){
								dkPopOver.parentNode.removeChild(dkPopOver);
							},500);
						}
					});
					/*Close Btn END*/
					if(defs.type == "confirm"){
						//closeBtn.classList.remove("primary");
						closeBtn.classList.add("danger");
						/* Confirm Btn */
						cnfBtn = document.createElement("a");
						cnfBtn.setAttribute("href", "javascript:;");
						cnfBtn.classList.add("pop-btn", "primary");
						cnfBtn.innerHTML = defs.confirmLabel;
						if(defs.model != "simple-confirm")
							cnfBtn.style.marginLeft = "10px";
						for(var key in defs.btnDatas)
							cnfBtn.setAttribute("data-" + key, defs.btnDatas[key]);
						
						cnfBtn.addEventListener("click", defs.confirmClick);
						footer.appendChild(cnfBtn);
						/* Confirm Btn END */
					}
					if(defs.wait <= 0){
						dkPop.appendChild(footer);
					}else{// WAIT TO CLOSE POPUP
						var tempFooter = footer.cloneNode(false);
						var wait = defs.wait;
						tempFooter.innerHTML = "Wait " + wait + " seconds...";
						dkPop.appendChild(tempFooter);
						wait--;
						var footerInterval = setInterval(function(){
							tempFooter.innerHTML = "Wait " + wait + " seconds...";
							wait--;
						},1000);
						setTimeout(function(){
							clearInterval(footerInterval);
							wait = undefined;
							dkPop.removeChild(tempFooter);
							dkPop.appendChild(footer);
						},(defs.wait*1000));
					}
				}
			middle.appendChild(dkPop);
		dkPopOver.appendChild(middle);
	document.body.appendChild(dkPopOver);
	//Remove in animation 
	setTimeout(function(){
		dkPop.classList.remove(defs.aniIn);
	},500);
	
	// Remove popup if be clicked out of popup
	dkPopOver.addEventListener("click", function(ev){
		if(ev.target.classList.contains("middle") && defs.closeable){
			if(defs.isRemoved == undefined && wait == undefined){
				defs.isRemoved = true;
				dkPop.classList.add(defs.aniOut);
				setTimeout(function(){
					dkPopOver.parentNode.removeChild(dkPopOver);
				},500);
			}
		}
	})
	// ESC KEY EVENT
	// Add eventlistener if popup is closeable and has not wait value
	/*if(defs.closeable && defs.wait <= 0){
		document.addEventListener("keydown", keyEventFunc);
	}
	function keyEventFunc(ev) {
		if(ev.keyCode == 27){
			if(defs.isRemoved == undefined){
				document.removeEventListener("keydown", keyEventFunc);
				defs.isRemoved = true;
				dkPop.classList.add(defs.aniOut);
				setTimeout(function(){
					dkPopOver.parentNode.removeChild(dkPopOver);
				},500);
			}
		}
	}*/
	// dkPopup will remove after if duration is avaible
	if(defs.duration > 0){
		setTimeout(function(){
			if(defs.isRemoved == undefined){
				defs.isRemoved = true;
				dkPop.classList.add(defs.aniOut);
				setTimeout(function(){
					dkPopOver.parentNode.removeChild(dkPopOver);
				},500);
			}
		},(defs.duration*1000 - 500));
	}
	
	return defs;
}


