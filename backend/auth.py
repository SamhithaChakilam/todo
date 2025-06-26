from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from config import db
from utils import generate_token

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if db.users.find_one({"email": data['email']}):
        return jsonify({"error": "User already exists"}), 409
    hashed_pw = generate_password_hash(data['password'])
    db.users.insert_one({"email": data['email'], "password": hashed_pw})
    token = generate_token(data['email'])
    return jsonify({"token": token}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = db.users.find_one({"email": data['email']})
    if user and check_password_hash(user['password'], data['password']):
        token = generate_token(data['email'])
        return jsonify({"token": token}), 200
    return jsonify({"error": "Invalid credentials"}), 401
