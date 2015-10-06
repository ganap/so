var validators={};

validators.validateRelatedPerson = function (person){
	var v={
		valid: true,
		error:{}
	};
	//
	//	Валиден ли адрес (все ли поля введены?)
	//
	if (person.address){
		var line=person.address.line;
		if (!line){ line=['']; }
		if (!line[0]){line=[''];}
		if (!person.address.city || !person.address.country || !line[0].length){
			v.valid=false;
			v.error.address=true;
		}
	}
	//
	//	Валидны ли все блоки с контактными данными
	//
	if (person.telecom.length){
		var invalid_n=[];
		for (var i = 0; i < person.telecom.length; i++) {
			if (!person.telecom[i].value){
				invalid_n.push(i);
			}
		};
		if (invalid_n){
			v.valid=false;
			v.error.telecom=invalid_n;
		}
	}
	//
	//	Введена ли хоть одна строка из relationship
	//
	if (!person.relationship.length){
		v.valid=false;
		v.error.relationship=true;
	}
	//
	//	Введены ли имя и фамилия
	//
	if (person.name){
		if (!person.name.given[0] || !person.name.family[0]){
			v.valid=false;
			v.error.name=true;
		}
	}
	return v;
}


validators.validatePatient = function (person){
	var v={
		valid: true,
		error:{}
	};
	var address, invalid_n=[];
	if (person==null || person==undefined){ return v; }
	//
	//	Валиден ли адрес (все ли поля введены?)
	//
	console.log(person);
	var length;
	if (person.address){
		length=person.address.length;
	}
	else{
		length=0;
	}
	if (length){
		invalid_n=[];
		for (var i = 0; i < person.address.length; i++) {
			var line=person.address[i].line;
			if (!line){ line=['']; }
			if (!line[0]){line=[''];}
			if (!person.address[i].city || !person.address[i].country || !line[0].length){
				invalid_n.push(i);
			}
		};
		if (invalid_n.length){
			v.valid=false;
			v.error.address=invalid_n;
			console.log("INVALID ADDRESS");
		}
	}
		
	//
	//	Валидны ли все блоки с контактными данными
	//
	if (person.telecom){
		len=person.telecom.length;
	}
	else{
		length=0;
	}
	if (length){
		var invalid_n=[];
		for (var i = 0; i < person.telecom.length; i++) {
			if (!person.telecom[i].value){
				invalid_n.push(i);
			}
		};
		if (invalid_n.length){
			v.valid=false;
			v.error.telecom=invalid_n;
			console.log("INVALID TELECOM");
		}
	}

	//
	//	Введены ли все имена и фамилии
	//
	if (person.name){
		length=person.name.length;
	}
	else{
		length=0;
	}
	if (length){
		var invalid_n=[];
		for (var i = 0; i < person.name.length; i++) {
			if (!person.name[i].given[0] || !person.name[i].family[0]){
				invalid_n.push(i);
			}
		};
		if (invalid_n.length){
			v.valid=false;
			v.error.name=invalid_n;
		}
	}

	return v;
}


var angular_helpers={};
angular_helpers.copy=function(to_, from_){
	var keys=Object.keys(from_);
	var key;
	for (var i = 0; i < keys.length; i++) {
		key=keys[i];
		if (key!='$$hashKey'){
			to_[key]=from_[key];
		}
	};

	var keys_to_=Object.keys(to_);
	var index;
	console.log(keys, keys_to_);
	if (keys!=keys_to_){
		//	Удаляем все поля которые появились в новом объекте 
		//	и которых там быть не должно
		for (var i = 0; i < keys_to_.length; i++) {
			key=keys_to_[i];
			index=keys.indexOf(key);
			if (index==-1){
				delete to_[key];
			}
		};
		return to_;
	}
	return to_;
}
