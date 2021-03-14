import psycopg2
from trycourier import Courier

class postfunction:
    def __init__(self):
        self.thing = 1
    
    def postScore(self, Name, Score, Phone):
        conn = psycopg2.connect(
            database='pure-lamb-1277.Scoreboard',
            user='jacob',
            password='testpassword',
            port=26257,
            host='free-tier.gcp-us-central1.cockroachlabs.cloud'
        )

        phoneNum = 0
        name = ""

        # Add the new score to the leaderboard and return the current place.
        with conn.cursor() as cur:
            cur.execute("INSERT INTO Scoreboard.Scores (Name, Score, Phone) VALUES ('" + Name + "', " + Score + ", " + Phone + ") RETURNING *;")
            conn.commit()
            rowID = cur.fetchone()[3]

            cur.execute("SELECT * FROM Scoreboard.Scores ORDER BY Score DESC;")
            rows = cur.fetchall()
            currRow = 0
            currPlace = 0
            for row in rows:
                currRow += 1
                if (row[3] == rowID):
                    currPlace = currRow
                    break
            
            if currRow < 11 and len(rows) > 10:
                phoneNum = rows[10][2]
                name = rows[10][0]
        
        conn.close()

        client = Courier(auth_token="dk_prod_2VGMFMHMF7459HQ4HN4GXW3SC3WD")
        resp = client.send(
            event="YP143Y45M4MXFGP648AVD0TMPTQ1",
            recipient="204a8da9-603e-4916-b567-970f54c40204",
            profile={
                "phone_number": phoneNum
            },
            data={
                "name": name,
                "source_url": "https://knightrider.tech"
            }
        )

        return {"Place": currPlace, "Response": resp['messageId']}      