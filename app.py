from config import app
from auth import auth
from todos import todos

app.register_blueprint(auth)
app.register_blueprint(todos)

if __name__ == '__main__':
    app.run(debug=True)
