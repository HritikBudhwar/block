from flask import Flask, jsonify, request
from flask_cors import CORS
from web3 import Web3
import json

app = Flask(__name__)
CORS(app)

# Configuration
# CONTRACT_ADDRESS = Web3.to_checksum_address("0x5FbDB2315678afecb367f032d93F642f64180aa3")
CONTRACT_ADDRESS = Web3.to_checksum_address("0x0165878A594ca255338adfa4d48449f69242Eb8F")

PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
ACCOUNT_ADDRESS = Web3.to_checksum_address("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
LOCAL_RPC = "http://127.0.0.1:8545"
CONTRACT_JSON_PATH = "./Token.json"

# Connect to local Ethereum node
w3 = Web3(Web3.HTTPProvider(LOCAL_RPC))
if not w3.is_connected():
    raise RuntimeError("Web3 connection failed. Make sure Hardhat is running.")
print("✅ Connected to Ethereum node")

# Load contract ABI
try:
    with open(CONTRACT_JSON_PATH) as f:
        abi = json.load(f).get("abi")
        if not abi:
            raise ValueError("ABI missing in contract JSON")
except Exception as e:
    raise RuntimeError(f"Failed to load ABI: {str(e)}")

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

# Quiz setup
QUIZ_QUESTION = {
    "question": "What does the N in NABC stand for?",
    "options": {
        "A": "Needs",
        "B": "Notion",
        "C": "Nurture",
        "D": "Approach"
    },
    "correct_answer": "A"
}

ACCOUNTS = {
    "Account 1": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "Account 2": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
}


@app.route("/quiz", methods=["GET"])
def get_quiz():
    return jsonify({
        "question": QUIZ_QUESTION["question"],
        "options": QUIZ_QUESTION["options"]
    })


@app.route("/transfer", methods=["POST"])
def transfer_tokens():
    data = request.get_json()
    sender = data.get("from")
    to = data.get("to")
    amount = data.get("amount")
    quiz_answer = data.get("quiz_answer", "").upper()

    print(f"📤 Transfer requested: from {sender} to {to} amount={amount}")

    try:
        sender = Web3.to_checksum_address(sender)
        to = Web3.to_checksum_address(to)
    except Exception:
        return jsonify({"error": "Invalid Ethereum address"}), 400

    if sender == ACCOUNT_ADDRESS:
        if quiz_answer != QUIZ_QUESTION["correct_answer"]:
            return jsonify({
                "error": "Incorrect quiz answer. Transfer denied.",
                "correct_answer": QUIZ_QUESTION["correct_answer"]
            }), 400
        amount = 50
    else:
        try:
            amount = int(amount)
            if amount <= 0:
                raise ValueError()
        except Exception:
            return jsonify({"error": "Invalid amount"}), 400

    try:
        nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)
        txn = contract.functions.transfer(to, amount).build_transaction({
            "from": ACCOUNT_ADDRESS,
            "nonce": nonce,
            "gas": 100000,
            "gasPrice": w3.to_wei("1", "gwei")
        })

        signed_txn = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)

        # Fetch updated balances
        sender_balance = contract.functions.balanceOf(sender).call()
        recipient_balance = contract.functions.balanceOf(to).call()

        return jsonify({
            "tx_hash": tx_hash.hex(),
            "amount_transferred": amount,
            "quiz_passed": sender == ACCOUNT_ADDRESS,
            "sender_balance": sender_balance,
            "recipient_balance": recipient_balance
        })

    except Exception as e:
        return jsonify({"error": f"Transaction failed: {str(e)}"}), 500


@app.route("/balance/<address>", methods=["GET"])
def get_balance(address):
    try:
        addr = Web3.to_checksum_address(address)
        balance = contract.functions.balanceOf(addr).call()
        name = contract.functions.name().call()
        symbol = contract.functions.symbol().call()
        return jsonify({
            "address": addr,
            "balance": balance,
            "token_name": name,
            "symbol": symbol
        })
    except Exception as e:
        return jsonify({"error": f"Failed to fetch balance: {str(e)}"}), 400


@app.route("/init", methods=["POST"])
def init_token():
    try:
        name = contract.functions.name().call()
        symbol = contract.functions.symbol().call()
        supply = contract.functions.totalSupply().call()

        balances = {
            label: contract.functions.balanceOf(Web3.to_checksum_address(addr)).call()
            for label, addr in ACCOUNTS.items()
        }

        return jsonify({
            "token": name,
            "symbol": symbol,
            "owner": ACCOUNT_ADDRESS,
            "totalSupply": supply,
            "balances": balances
        })
    except Exception as e:
        return jsonify({"error": f"Init failed: {str(e)}"}), 500


@app.route("/")
def home():
    return jsonify({"message": "Backend is running."})


if __name__ == "__main__":
    app.run(debug=True, port=5000)








# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from web3 import Web3
# import json
# import os

# app = Flask(__name__)
# CORS(app)

# # Configuration
# LOCAL_RPC = "http://127.0.0.1:8545"
# PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
# ACCOUNT_ADDRESS = Web3.to_checksum_address("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
# CONTRACT_JSON_PATH = "./Token.json"

# # Initialize Web3
# w3 = Web3(Web3.HTTPProvider(LOCAL_RPC))
# if not w3.is_connected():
#     raise RuntimeError("❌ Web3 connection failed. Is Hardhat running?")
# print("✅ Connected to Ethereum node")

# # Load Contract ABI and Address
# try:
#     with open(CONTRACT_JSON_PATH) as f:
#         contract_json = json.load(f)
#         abi = contract_json.get("abi")
#         address = contract_json.get("networks", {}).get("31337", {}).get("address")  # Local Hardhat network ID
#         if not abi or not address:
#             raise ValueError("ABI or contract address missing in JSON")
#         CONTRACT_ADDRESS = Web3.to_checksum_address(address)
# except Exception as e:
#     raise RuntimeError(f"❌ Failed to load ABI/address: {e}")

# contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

# # Static Quiz
# QUIZ_QUESTION = {
#     "question": "What does the N in NABC stand for?",
#     "options": {
#         "A": "Needs",
#         "B": "Notion",
#         "C": "Nurture",
#         "D": "Approach"
#     },
#     "correct_answer": "A"
# }

# ACCOUNTS = {
#     "Account 1": ACCOUNT_ADDRESS,
#     "Account 2": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
# }


# @app.route("/quiz", methods=["GET"])
# def get_quiz():
#     return jsonify({
#         "question": QUIZ_QUESTION["question"],
#         "options": QUIZ_QUESTION["options"]
#     })


# @app.route("/transfer", methods=["POST"])
# def transfer_tokens():
#     data = request.get_json()
#     sender = data.get("from")
#     to = data.get("to")
#     amount = data.get("amount")
#     quiz_answer = data.get("quiz_answer", "").upper()

#     try:
#         sender = Web3.to_checksum_address(sender)
#         to = Web3.to_checksum_address(to)
#     except Exception:
#         return jsonify({"error": "Invalid Ethereum address"}), 400

#     # Validate amount
#     if sender == ACCOUNT_ADDRESS:
#         if quiz_answer != QUIZ_QUESTION["correct_answer"]:
#             return jsonify({
#                 "error": "Incorrect quiz answer. Transfer denied.",
#                 "correct_answer": QUIZ_QUESTION["correct_answer"]
#             }), 400
#         amount = 50
#     else:
#         try:
#             amount = int(amount)
#             if amount <= 0:
#                 raise ValueError("Amount must be positive")
#         except:
#             return jsonify({"error": "Invalid transfer amount"}), 400

#     # Check sender balance
#     try:
#         sender_balance = contract.functions.balanceOf(ACCOUNT_ADDRESS).call()
#         if sender_balance < amount:
#             return jsonify({"error": "Insufficient balance"}), 400
#     except Exception as e:
#         return jsonify({"error": f"Balance check failed: {str(e)}"}), 500

#     try:
#         nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)
#         txn = contract.functions.transfer(to, amount).build_transaction({
#             "from": ACCOUNT_ADDRESS,
#             "nonce": nonce,
#             "gas": 100000,
#             "gasPrice": w3.to_wei("1", "gwei")
#         })

#         signed_txn = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)
#         tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)

#         # Get updated balances
#         updated_sender = contract.functions.balanceOf(sender).call()
#         updated_recipient = contract.functions.balanceOf(to).call()

#         return jsonify({
#             "tx_hash": tx_hash.hex(),
#             "amount_transferred": amount,
#             "quiz_passed": sender == ACCOUNT_ADDRESS,
#             "sender_balance": updated_sender,
#             "recipient_balance": updated_recipient
#         })

#     except Exception as e:
#         return jsonify({"error": f"Transaction failed: {str(e)}"}), 500


# @app.route("/balance/<address>", methods=["GET"])
# def get_balance(address):
#     try:
#         addr = Web3.to_checksum_address(address)
#         balance = contract.functions.balanceOf(addr).call()
#         name = contract.functions.name().call()
#         symbol = contract.functions.symbol().call()
#         return jsonify({
#             "address": addr,
#             "balance": balance,
#             "token_name": name,
#             "symbol": symbol
#         })
#     except Exception as e:
#         return jsonify({"error": f"Failed to fetch balance: {str(e)}"}), 400


# @app.route("/init", methods=["POST"])
# def init_token():
#     try:
#         name = contract.functions.name().call()
#         symbol = contract.functions.symbol().call()
#         supply = contract.functions.totalSupply().call()

#         balances = {
#             label: contract.functions.balanceOf(Web3.to_checksum_address(addr)).call()
#             for label, addr in ACCOUNTS.items()
#         }

#         return jsonify({
#             "token": name,
#             "symbol": symbol,
#             "owner": ACCOUNT_ADDRESS,
#             "totalSupply": supply,
#             "balances": balances
#         })
#     except Exception as e:
#         return jsonify({"error": f"Init failed: {str(e)}"}), 500


# @app.route("/")
# def home():
#     return jsonify({"message": "✅ Flask backend is running."})


# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
