# import requests

# url = "http://127.0.0.1:5000/call"
# data = {
#     "callID": 5,
#     "userID": "u001",
#     "transcripts": "This is a sample transcript.",
#     "severityScore": 5,
#     "date": "2025-09-27T22:00:00"
# }

# response = requests.post(url, json=data)
# print(response.status_code)
# print(response.json())


<<<<<<< HEAD
# import requests

# url = "http://127.0.0.1:5000/user/user_001"
# data = {
#     "callID": 6
# }

# response = requests.put(url, json=data)
# print(response.status_code)
# print(response.json())
=======
import requests

url = "http://127.0.0.1:5000/user/u001"
data = {
    "callID": 6
}

response = requests.put(url, json=data)
print(response.status_code)
print(response.json())
>>>>>>> 2e7c151 (upload testing to test endpoint)
