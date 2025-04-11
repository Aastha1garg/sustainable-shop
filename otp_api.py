from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import random
import requests

app = Flask(__name__)

# Configure Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'  # Use MySQL/PostgreSQL if needed
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    otp = db.Column(db.String(6), nullable=False)

# Generate OTP
def generate_otp():
    return str(random.randint(100000, 999999))

# Send OTP API
@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    phone = data.get('phone')

    if not phone:
        return jsonify({"error": "Phone number is required"}), 400

    otp = generate_otp()
    user = User.query.filter_by(phone=phone).first()

    if user:
        user.otp = otp
    else:
        user = User(phone=phone, otp=otp)
        db.session.add(user)

    db.session.commit()

    # Exotel SMS API
    EXOTEL_SID = "zomato228"
    EXOTEL_TOKEN = "3a261fa94a444d06c96e698a43d6fc29f143e82144daa225"
    EXOTEL_SMS_URL = f"https://api.exotel.com/v1/Accounts/zomato228/Sms/send"

    payload = {
        "From": "919024945563",
        "To": phone,
        "Body": f"Your OTP is {otp}"
    }

    response = requests.post(EXOTEL_SMS_URL, auth=(EXOTEL_SID, EXOTEL_TOKEN), data=payload)

    if response.status_code == 200:
        return jsonify({"message": "OTP sent successfully", "otp": otp}), 200
    else:
        return jsonify({"error": "Failed to send OTP", "details": response.text}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True, port=5432)
