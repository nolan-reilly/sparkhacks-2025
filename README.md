# sparkhacks-2025
Mac Users: 
python3 -m venv env
source env/bin/activate 
pip install Flask Flask-SQLAlchemy Flask-Migrate
flask db init
flask db migrate -m "initial migration"
flask db upgrade
flask --app app run --debug
