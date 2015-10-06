MANAGE=./manage.py
SETTINGS=www_site.settings
PYTHON=python2

TERM=gnome-terminal
TERM_ARGS=-e


test:
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) test main_app

run:
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) runserver localhost:8000

syncdb:
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) syncdb --noinput

shell:
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost'  $(PYTHON) $(MANAGE) shell

dropUsersLocal:
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) DropUsers

dropDbLocal:
	rm db.sqlite3
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) DropMongoLab
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) syncdb --noinput
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) FillSitePref
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) FillDBWithCCList
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) CreateUsers

dropDb:
	rm db.sqlite3
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) DropMongoLab
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) syncdb --noinput
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) FillSitePref
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) FillDBWithCCList
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) CreateUsers


gshell:
	gcloud compute --project "glossy-metric-106518" ssh --zone "europe-west1-b" "main"

gshell3:
	gcloud compute --project "glossy-metric-106518" ssh --zone "europe-west1-b" "main-3"



media:
	mkdir /var/www/app/media_files
	mkdir /var/www/app/media_files/avatars

apache:
	cp /var/www/app/apache.conf /etc/apache2/sites-enabled/000-default.conf
	chown -R www-data /var/www/app/*
	cp boto /root/.boto
	apachectl graceful

collectTrString:
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) CollectTranslationStrings 

drop-db-local:
	rm ./db.sqlite3
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) DropMongoLab
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) syncdb --noinput
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) InitValue 
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) SERVER='localhost' $(PYTHON) $(MANAGE) CreateUsers 

mongo-install:
	curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.0.6.tgz
	tar -zxvf mongodb-linux-x86_64-3.0.6.tgz
	mkdir -p /usr/local/mongodb
	cp -R -n mongodb-linux-x86_64-3.0.6/ /usr/local/mongodb
	mkdir /data
	mkdir /data/db

mongod:
	cp ./mongodb.service /etc/init/mongodb.conf
	service mongodb restart

deploy:
	gcloud compute --project "glossy-metric-106518" copy-files ./payment ./basic_documents ./fhir_profiles ./helpers ./L18n ./profiles ./restmongo ./site_pref ./permissions ./so ./gcloud ./Makefile ./www_site ubuntu@main:/var/www/app  --zone europe-west1-b 

deploy3:
	gcloud compute --project "glossy-metric-106518" copy-files ./payment ./basic_documents ./fhir_profiles ./helpers ./L18n ./profiles ./restmongo ./site_pref ./permissions ./so ./gcloud ./Makefile ./www_site ubuntu@main-3:/var/www/app  --zone europe-west1-b 
 

deploy-static:
	gcloud compute --project "glossy-metric-106518" copy-files ./static/*_app ./static/img  ./static/helpers ./static/djRest.js  ./static/whirly.css ./static/*.less ./static/*.css ubuntu@main:/var/www/app/static  --zone europe-west1-b
	gcloud compute --project "glossy-metric-106518" copy-files ./static/libs/login ubuntu@main:/var/www/app/static/libs  --zone europe-west1-b
	gcloud compute --project "glossy-metric-106518" copy-files ./static/webrtc_call_one2one ubuntu@main:/var/www/app/static  --zone europe-west1-b

deploy-static3:
	gcloud compute --project "glossy-metric-106518" copy-files ./static/*_app ./static/img  ./static/helpers ./static/djRest.js  ./static/whirly.css ./static/*.less ubuntu@main-3:/var/www/app/static  --zone europe-west1-b
	gcloud compute --project "glossy-metric-106518" copy-files ./static/libs/login ubuntu@main-3:/var/www/app/static/libs  --zone europe-west1-b
	gcloud compute --project "glossy-metric-106518" copy-files ./static/webrtc_call_one2one ubuntu@main-3:/var/www/app/static  --zone europe-west1-b



deploy-static-all:
	gcloud compute --project "glossy-metric-106518"  copy-files ./static ubuntu@main:/var/www/app  --zone europe-west1-b


deploy-static-main:
	gcloud compute copy-files ./static/main_app  root@main:/var/www/app/static  --zone europe-west1-b

deploy-special:
	gcloud compute copy-files ./main_app ./Makefile root@main:/var/www/app  --zone europe-west1-b
	gcloud compute copy-files ./static root@main:/var/www/app  --zone europe-west1-b



#kirill

install_virtualenv2:
	( \
		virtualenv .virtualenv/p2;\
		chmod +x .virtualenv/p2/bin/activate;\
		ln -s .virtualenv/p2/bin/activate ap2;\
		source .virtualenv/p2/bin/activate;\
		pip2 install -r ./requirements.txt;\
	)

krunserver:
	$(TERM) $(TERM_ARGS) $(PYTHON) $(MANAGE) runserver &

clean:
	find ./hermes/ -name "*.pyc" -delete
	find ./hermes/ -name "*.pyo" -delete
	find ./hermes/ -name "*.sw?" -delete
	find ./main_app/ -name "*.pyc" -delete
	find ./main_app/ -name "*.pyo" -delete
	find ./main_app/ -name "*.sw?" -delete

mkmigration_initial:
	$(PYTHON) $(MANAGE) schemamigration --intial

mkmigration:
	$(PYTHON) $(MANAGE) makemigrations 

migrate:
	$(PYTHON) $(MANAGE) migrate

kmail_server:
	$(TERM) $(TERM_ARGS) python -m smtpd -n -c DebuggingServer localhost:1025 &

mail_server:
	python -m smtpd -n -c DebuggingServer localhost:1025 &


smart_on_fhir:
	apt-get update
	apt-get install curl git python-pycurl python-pip python-yaml python-paramiko python-jinja2 postgresql postgresql-contrib 
