MANAGE=./manage.py
SETTINGS=hermes.settings
PYTHON=python2

TERM=gnome-terminal
TERM_ARGS=-e


test:
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) test main_app

run:
	PYTHONPATH=`pwd` SERVER='localhost' $(PYTHON) ./server.py 

syncdb:
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) syncdb --noinput

shell:
	PYTHONPATH=`pwd` DJANGO_SETTINGS_MODULE=$(SETTINGS) $(PYTHON) $(MANAGE) shell

gshell:
	gcloud compute --project "glossy-metric-106518" ssh --zone "europe-west1-b" "tornado"

gshell3:
	gcloud compute --project "glossy-metric-106518" ssh --zone "europe-west1-b" "tornado-3"



tornado:
	chown -R www-data /var/www/app/*
	cp /var/www/app/tornado_ubuntu_service.conf /etc/init/tornado_ubuntu_service.conf
	service tornado_ubuntu_service restart


deploy:
	gcloud compute --project "glossy-metric-106518" copy-files ./rest ./server.py ./tornado_ubuntu_service.conf ./Makefile ./requirements.txt ubuntu@tornado:/var/www/app  --zone europe-west1-b

deploy3:
	gcloud compute --project "glossy-metric-106518" copy-files ./rest ./server.py ./Makefile ./requirements.txt ubuntu@tornado-3:/var/www/app  --zone europe-west1-b




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
