from flask import Blueprint, request, jsonify
from bson import ObjectId
from config import db
from utils import token_required

todos = Blueprint('todos', __name__)

@todos.route('/todos', methods=['GET'])
@token_required
def get_todos(user_email):
    data = list(db.todos.find({"email": user_email}))
    for item in data:
        item['_id'] = str(item['_id'])
    return jsonify(data), 200

@todos.route('/todos', methods=['POST'])
@token_required
def add_todo(user_email):
    data = request.json
    if not data.get("title"):
        return jsonify({"error": "Title is required"}), 400
    db.todos.insert_one({"email": user_email, "title": data['title']})
    return jsonify({"msg": "Todo added"}), 201

@todos.route('/todos/<todo_id>', methods=['DELETE'])
@token_required
def delete_todo(user_email, todo_id):
    result = db.todos.delete_one({"_id": ObjectId(todo_id), "email": user_email})
    if result.deleted_count == 0:
        return jsonify({"error": "Todo not found or unauthorized"}), 404
    return jsonify({"msg": "Todo deleted"}), 200
