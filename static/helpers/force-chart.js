var IMG_SIZE=50;
var force_helpers = {
	xForTitle: function(d){
		//	персонал - слева
		//
		if (d.is_moderator || d.is_admin || d.is_organization){
			return IMG_SIZE/2;
		}
		//	остальные - справа
		return -IMG_SIZE/2;
	},
	yForTitle: function(number){
		if (number==1) return '0.35em';
		if (number==2) return '1.85em';
	},
	getCircleCip: function(d){
		if (d.is_moderator || d.is_admin || d.is_organization || typeof(d.expert)=='object'
			|| typeof(d.pk)=='string'){
			return "url('#circleCip')";
		}
		return "url('#circleCipBig')";
	},
	getImgSize: function(d){
		if (d.main){
			return IMG_SIZE*1.2;
		}
		return IMG_SIZE;
	},
	textAlign: function(d){
		if (d.is_moderator || d.is_admin || d.is_organization ){
			return "start";
		}
		return "end";
	},
	getName: function(d){
		var user, name, given, family;
		var line='';
		if (d.main) return '';
		if (typeof(d.patient)=='object'){
			user=d.patient;
		}
		if (typeof(d.expert)=='object'){
			user=d.expert;
		}
		if (!user){
			//это relatedPerson
			user=d;
		}
		name=user.name[0];
		if (!name){
			name=user.name;
		}
		for (var f in name.prefix){
			line=line+name.prefix[f]+" ";
		}

		for (var g in name.given){
			line=line+name.given[g]+" ";
		}
		for (var f in name.family){
			line=line+name.family[f]+" ";
		}
		for (var g in name.suffix){
			line=line+name.suffix[g]+" ";
		}
		return line;
	},
	getSummary: function(d){
		if (d.is_moderator) return 'Care Coordinator';
		if (d.is_admin) return 'Administrator';
		//	член Care teem
		//
		if (d.relationship){
			return d.relationship.toString();
		}
	},
	getAvatar: function(d){
		var name;
		if (d.is_moderator){
			name="moderator";
		}
		if (d.is_admin){
			name="admin";
		}
		if (name){
			return "/static/img/"+name+"-tiny.png";
		}
		name=d.pk;
		if (typeof(name)=='string'){
			var index=d.index;
			if (index>4){
				index=1;
			}
			return "/static/img/avatars/"+d.gender+"-"+index+"-tiny.jpg";
		}
		return "/media_files/avatars/"+name+"-tiny.jpg";
	},
	xyImgPosition: function(d){
		if (d.main){
			return -IMG_SIZE*1.2/2;
		}
		return -IMG_SIZE/2;
	},
}
